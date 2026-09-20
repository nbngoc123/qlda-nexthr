'use client';

import { useEffect, useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api } from '@/services/api';
import styles from './page.module.css';

// Type Definitions
type ItemStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE';

interface WorkItem {
  id: string;
  title: string;
  status: ItemStatus;
  priority: string;
  progress: number;
}

// Columns definition
const COLUMNS: { id: ItemStatus; title: string }[] = [
  { id: 'TODO', title: 'To Do' },
  { id: 'IN_PROGRESS', title: 'In Progress' },
  { id: 'REVIEW', title: 'Review' },
  { id: 'DONE', title: 'Done' }
];

// Sortable Item Component
const SortableItem = ({ item, user }: { item: WorkItem; user: any }) => {
  let canDrag = false;
  if (user) {
    if (['PM', 'TEAM_LEAD', 'REVIEWER', 'ADMIN'].includes(user.role)) {
      canDrag = true;
    } else if (user.role === 'MEMBER') {
      canDrag = true; // Sẽ check kỹ logic (assignee, hướng kéo) lúc Drop
    }
    // C_LEVEL sẽ là false
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id, disabled: !canDrag });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: canDrag ? (isDragging ? 'grabbing' : 'grab') : 'not-allowed',
    opacity: canDrag ? 1 : 0.8
  };

  const priorityClass = 
    item.priority === 'HIGH' ? styles.priorityHigh :
    item.priority === 'MEDIUM' ? styles.priorityMedium :
    styles.priorityLow;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`${styles.card} ${isDragging ? styles.cardDragging : ''}`}
    >
      <div className={styles.cardTitle}>{item.title}</div>
      <div className={styles.cardFooter}>
        <span className={`${styles.priority} ${priorityClass}`}>{item.priority}</span>
        <span>{item.progress}%</span>
      </div>
    </div>
  );
};

export default function KanbanBoardPage() {
  const [items, setItems] = useState<WorkItem[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const projRes = await api.get('/projects');
      if (projRes.data.length > 0) {
        const pId = projRes.data[0].id;
        setProjectId(pId);
        
        const boardRes = await api.get(`/projects/${pId}/work-items`);
        let fetchedItems: WorkItem[] = [];
        if (Array.isArray(boardRes.data)) {
           fetchedItems = boardRes.data;
        } else if (boardRes.data && Array.isArray(boardRes.data.data)) {
           fetchedItems = boardRes.data.data;
        }
        setItems(fetchedItems);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const showError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(null), 5000);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const isOverAColumn = COLUMNS.some(c => c.id === overId);
    
    const activeItem = items.find(i => i.id === activeId);
    if (!activeItem) return;

    let newStatus = activeItem.status;

    if (isOverAColumn) {
      newStatus = overId as ItemStatus;
    } else {
      const overItem = items.find(i => i.id === overId);
      if (overItem) {
        newStatus = overItem.status;
      }
    }

    if (activeItem.status !== newStatus) {
      // ===== RBAC VALIDATION FRONTEND =====
      if (user?.role === 'MEMBER') {
        if (newStatus === 'DONE') {
          showError('Quyền truy cập bị từ chối: Chỉ Reviewer/PM mới có quyền duyệt hoàn thành công việc (DONE).');
          return;
        }
        if (activeItem.status === 'REVIEW' && newStatus === 'IN_PROGRESS') {
          showError('Quyền truy cập bị từ chối: Chỉ Reviewer/PM mới có quyền Từ chối (Reject) bài nộp.');
          return;
        }
      }

      // Optimistic update
      setItems(prev => prev.map(item => 
        item.id === activeId ? { ...item, status: newStatus } : item
      ));

      // API Call
      try {
        await api.patch(`/work-items/${activeId}/status`, { status: newStatus });
      } catch (e: any) {
        console.error('Update status failed', e);
        showError(e.response?.data?.message || 'Cập nhật trạng thái thất bại do thiếu quyền hạn.');
        // Rollback
        fetchInitialData();
      }
    }
  };

  if (loading) return <div>Đang tải bảng Kanban...</div>;
  if (!projectId) return <div className={styles.emptyState}>Không tìm thấy dự án nào.</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Bảng Kanban</h1>
      </header>

      {/* Hiển thị Error Notification (Toast/Alert) */}
      {errorMsg && (
        <div className={styles.errorAlert}>
          ⚠️ {errorMsg}
        </div>
      )}
      
      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragEnd={handleDragEnd}
      >
        <div className={styles.board}>
          {COLUMNS.map(column => {
            const columnItems = items.filter(i => i.status === column.id);
            return (
              <div key={column.id} className={styles.column}>
                <div className={styles.columnHeader}>
                  <div className={styles.columnTitle}>
                    {column.title} 
                    <span className={styles.badge}>{columnItems.length}</span>
                  </div>
                </div>
                
                <SortableContext 
                  id={column.id} 
                  items={columnItems.map(i => i.id)} 
                  strategy={verticalListSortingStrategy}
                >
                  <div className={styles.cardList}>
                    {columnItems.map(item => (
                      <SortableItem key={item.id} item={item} user={user} />
                    ))}
                    {columnItems.length === 0 && (
                      <div style={{ height: '40px' }} />
                    )}
                  </div>
                </SortableContext>
              </div>
            );
          })}
        </div>
      </DndContext>
    </div>
  );
}
