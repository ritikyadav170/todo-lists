import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskCard from '../components/TaskCard';

describe('TaskCard Component', () => {
  const mockTask = {
    _id: '123',
    title: 'Finishing Wireframe',
    dueAt: '2026-11-12T10:00:00.000Z',
    startTime: '10:00 AM',
    endTime: '11:30 AM',
    priority: 'High',
    status: 'In Progress',
  };

  it('renders task title, priority, and time correctly', () => {
    render(
      <TaskCard
        task={mockTask}
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Finishing Wireframe')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('10:00 AM - 11:30 AM')).toBeInTheDocument();
  });

  it('triggers onToggleStatus when checkbox is clicked', () => {
    const handleToggle = vi.fn();

    render(
      <TaskCard
        task={mockTask}
        onToggleStatus={handleToggle}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(handleToggle).toHaveBeenCalledWith('123');
  });

  it('renders line-through styling when task is Completed', () => {
    const completedTask = {
      ...mockTask,
      status: 'Completed',
    };

    render(
      <TaskCard
        task={completedTask}
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const titleEl = screen.getByText('Finishing Wireframe');
    expect(titleEl).toHaveClass('line-through');
  });
});

