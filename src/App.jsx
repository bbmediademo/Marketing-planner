import React, { useState } from 'react';
import { useStore } from './store';
import TopBar from './components/TopBar';
import WeekView from './components/WeekView';
import ProjectsView from './components/ProjectsView';
import AddTaskModal from './components/AddTaskModal';
import SettingsModal from './components/SettingsModal';

export default function App() {
  const { toast } = useStore();
  const [activeTab, setActiveTab] = useState('week');
  const [showSettings, setShowSettings] = useState(false);
  const [taskModal, setTaskModal] = useState(null); // null | 'new' | task object

  const handleAddTask = () => setTaskModal('new');
  const handleEditTask = (task) => setTaskModal(task);
  const handleCloseTask = () => setTaskModal(null);

  return (
    <>
      <TopBar
        onSettings={() => setShowSettings(true)}
        onICS={() => setShowSettings(true)}
      />

      <div className="tabs">
        <button className={`tab ${activeTab === 'week' ? 'active' : ''}`} onClick={() => setActiveTab('week')}>
          Weekplanning
        </button>
        <button className={`tab ${activeTab === 'projecten' ? 'active' : ''}`} onClick={() => setActiveTab('projecten')}>
          Projecten
        </button>
      </div>

      <div className="app-body">
        <div className={`view ${activeTab === 'week' ? 'active' : ''}`} style={{ flexDirection: 'column' }}>
          <WeekView onAddTask={handleAddTask} onEditTask={handleEditTask} />
        </div>
        <div className={`view ${activeTab === 'projecten' ? 'active' : ''}`} style={{ flexDirection: 'column' }}>
          <ProjectsView onAddTask={handleAddTask} />
        </div>
      </div>

      {taskModal && (
        <AddTaskModal
          task={taskModal === 'new' ? null : taskModal}
          onClose={handleCloseTask}
        />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}
