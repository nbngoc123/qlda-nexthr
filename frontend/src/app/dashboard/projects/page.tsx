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
const SortableItem = ({ item }: { item: WorkItem }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      // Fetch user's projects to get a project ID
      const projRes = await api.get('/projects');
      if (projRes.data.length > 0) {
        const pId = projRes.data[0].id;
        setProjectId(pId);
        // Fetch board data
        const boardRes = await api.get(`/projects/${pId}/work-items`);
        // The API returns an array of work items
        let fetchedItems: WorkItem[] = [];
        if (Array.isArray(boardRes.data)) {
           fetchedItems = boardRes.data;
        } else if (boardRes.data && Array.isArray(boardRes.data.data)) {
           // In case it's paginated
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

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Is it dropping over a column or an item?
    const isOverAColumn = COLUMNS.some(c => c.id === overId);
    
    // Find active item
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
      // Optimistic update
      setItems(prev => prev.map(item => 
        item.id === activeId ? { ...item, status: newStatus } : item
      ));

      // API Call
      try {
        await api.patch(`/work-items/${activeId}/status`, { status: newStatus });
      } catch (e) {
        console.error('Update status failed', e);
        // Revert on failure (simplified)
        fetchInitialData();
      }
    }
  };

  if (loading) return <div>Đang tải bảng Kanban...</div>;
  if (!projectId) return <div className={styles.emptyState}>Không tìm thấy dự án nào. Vui lòng tạo dự án qua API trước.</div>;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Bảng Kanban</h1>
      </header>
      
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
                      <SortableItem key={item.id} item={item} />
                    ))}
                    {/* Empty drop zone placeholder */}
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
