import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WeekCard from '../components/WeekCard';

describe('WeekCard Component', () => {
  const mockWeek = {
    weekStart: '2026-11-09T00:00:00.000Z',
    weekEnd: '2026-11-15T23:59:59.999Z',
    open: 3,
    completed: 5,
    total: 8,
  };

  const mockTasks = [
    {
      _id: 't1',
      title: 'Finishing Wireframe',
      dueAt: '2026-11-10T10:00:00.000Z',
      priority: 'High',
      status: 'In Progress',
    },
    {
      _id: 't2',
      title: 'Buy a cat food',
      dueAt: '2026-11-11T14:00:00.000Z',
      priority: 'Low',
      status: 'Completed',
    },
  ];

  it('renders week date range and task statistics correctly', () => {
    render(
      <WeekCard
        week={mockWeek}
        tasks={mockTasks}
        isExpanded={false}
        onToggle={vi.fn()}
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('09 Nov - 15 Nov')).toBeInTheDocument();
    expect(screen.getByText('5 Completed')).toBeInTheDocument();
    expect(screen.getByText('3 Open')).toBeInTheDocument();
    expect(screen.getByText(/8 Total/)).toBeInTheDocument();
  });

  it('calls onToggle when clicking the week card header', () => {
    const handleToggle = vi.fn();

    render(
      <WeekCard
        week={mockWeek}
        tasks={mockTasks}
        isExpanded={false}
        onToggle={handleToggle}
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleToggle).toHaveBeenCalledTimes(1);
  });

  it('renders tasks inside accordion when isExpanded is true', () => {
    render(
      <WeekCard
        week={mockWeek}
        tasks={mockTasks}
        isExpanded={true}
        onToggle={vi.fn()}
        onToggleStatus={vi.fn()}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    );

    expect(screen.getByText('Finishing Wireframe')).toBeInTheDocument();
    expect(screen.getByText('Buy a cat food')).toBeInTheDocument();
  });
});

