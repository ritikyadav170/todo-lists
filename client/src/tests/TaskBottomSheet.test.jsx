import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TaskBottomSheet from '../components/TaskBottomSheet';

describe('TaskBottomSheet Component', () => {
  it('renders form inputs when isOpen is true', () => {
    render(
      <TaskBottomSheet
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
      />
    );

    expect(screen.getByText('Add New Task')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Doing Homework')).toBeInTheDocument();
    expect(screen.getByText('Set Time')).toBeInTheDocument();
    expect(screen.getByText('Set Date')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create task/i })).toBeInTheDocument();
  });

  it('displays validation error when submitting with empty title', () => {
    const handleSubmit = vi.fn();

    render(
      <TaskBottomSheet
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
      />
    );

    const form = screen.getByRole('form', { name: 'task-form' });
    fireEvent.submit(form);

    expect(screen.getByText('Task title is required')).toBeInTheDocument();
    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct payload when valid data is entered', async () => {
    const handleSubmit = vi.fn().mockResolvedValue(true);

    render(
      <TaskBottomSheet
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={handleSubmit}
      />
    );

    const titleInput = screen.getByPlaceholderText('Doing Homework');
    fireEvent.change(titleInput, { target: { value: 'Finishing Wireframe' } });

    // Select Medium priority
    const mediumBtn = screen.getByRole('button', { name: 'Medium' });
    fireEvent.click(mediumBtn);

    const form = screen.getByRole('form', { name: 'task-form' });
    fireEvent.submit(form);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    const callArg = handleSubmit.mock.calls[0][0];
    expect(callArg.title).toBe('Finishing Wireframe');
    expect(callArg.priority).toBe('Medium');
    expect(callArg).toHaveProperty('dueAt');
  });

  it('prefills fields when editing existing task', () => {
    const mockTask = {
      _id: 'task123',
      title: 'Buy a cat food',
      description: 'Salmon flavor',
      dueAt: '2026-11-12T14:00:00.000Z',
      startTime: '02:00 PM',
      endTime: '02:30 PM',
      priority: 'Low',
      status: 'Completed',
    };

    render(
      <TaskBottomSheet
        isOpen={true}
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        initialData={mockTask}
      />
    );

    expect(screen.getByText('Edit Task')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Buy a cat food')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Salmon flavor')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });
});
