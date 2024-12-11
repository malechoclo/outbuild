import { render, fireEvent, screen } from "@testing-library/react";
import App from "./../App";
import socket from "./../utils/socket"; // Mock socket

jest.mock("./../utils/socket", () => ({
    on: jest.fn(),
    emit: jest.fn(),
}));

describe("Task Management Application", () => {
    beforeEach(() => {
        render(<App />);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should create a task", () => {
        const descriptionInput = screen.getByPlaceholderText("Task description (max 50 chars)");
        const urgencySelect = screen.getByText("Select urgency");
        const deadlineInput = screen.getByLabelText("Deadline");
        const addButton = screen.getByText("Add Task");

        fireEvent.change(descriptionInput, { target: { value: "Test Task" } });
        fireEvent.change(urgencySelect, { target: { value: "medium" } });
        fireEvent.change(deadlineInput, { target: { value: "2024-12-12" } });
        fireEvent.click(addButton);

        expect(screen.getByText("Test Task")).toBeInTheDocument();
    });

    test("should delete a task", () => {
        // Create a task first
        const descriptionInput = screen.getByPlaceholderText("Task description (max 50 chars)");
        const addButton = screen.getByText("Add Task");

        fireEvent.change(descriptionInput, { target: { value: "Task to Delete" } });
        fireEvent.click(addButton);

        // Delete the created task
        const deleteButton = screen.getByText("Task to Delete").nextSibling.querySelector("button");
        fireEvent.click(deleteButton);

        expect(screen.queryByText("Task to Delete")).not.toBeInTheDocument();
    });

    test("should edit a task", () => {
        // Create a task
        const descriptionInput = screen.getByPlaceholderText("Task description (max 50 chars)");
        const addButton = screen.getByText("Add Task");

        fireEvent.change(descriptionInput, { target: { value: "Old Task" } });
        fireEvent.click(addButton);

        // Edit the created task
        const editButton = screen.getByText("Old Task").nextSibling.querySelector("button");
        fireEvent.click(editButton);

        const editInput = screen.getByLabelText("Edit Content");
        fireEvent.change(editInput, { target: { value: "Updated Task" } });

        const saveButton = screen.getByText("Save");
        fireEvent.click(saveButton);

        expect(screen.queryByText("Updated Task")).toBeInTheDocument();
    });

    test("should move a task between columns", () => {
        // Create a task
        const descriptionInput = screen.getByPlaceholderText("Task description (max 50 chars)");
        const addButton = screen.getByText("Add Task");

        fireEvent.change(descriptionInput, { target: { value: "Move Task" } });
        fireEvent.click(addButton);

        // Simulate dragging and dropping
        const task = screen.getByText("Move Task");
        const doneColumn = screen.getByText("DONE");

        fireEvent.dragStart(task);
        fireEvent.drop(doneColumn);

        expect(screen.getByText("Move Task").parentNode).toHaveTextContent("DONE");
    });

    test("should update user count when a client connects", () => {
        // Simulate a new client connecting via socket
        socket.on.mockImplementation((event, callback) => {
            if (event === "client-count") callback(1);
        });

        expect(screen.getByText("1")).toBeInTheDocument();
    });

    test("should highlight task when edited by another client", () => {
        // Create a task
        const descriptionInput = screen.getByPlaceholderText("Task description (max 50 chars)");
        const addButton = screen.getByText("Add Task");

        fireEvent.change(descriptionInput, { target: { value: "Highlight Task" } });
        fireEvent.click(addButton);

        // Simulate another client editing the task
        socket.on.mockImplementation((event, callback) => {
            if (event === "highlight-task") callback({ "Highlight Task": "different-client" });
        });

        expect(screen.getByText("Highlight Task")).toHaveClass("opacity-50 editing");
    });

    test("should highlight task when moved by another client", () => {
        // Create a task
        const descriptionInput = screen.getByPlaceholderText("Task description (max 50 chars)");
        const addButton = screen.getByText("Add Task");

        fireEvent.change(descriptionInput, { target: { value: "Moved Task" } });
        fireEvent.click(addButton);

        // Simulate another client moving the task
        socket.on.mockImplementation((event, callback) => {
            if (event === "task-update") callback({ column: "done", taskId: "1" });
        });

        expect(screen.getByText("Moved Task")).toHaveClass("opacity-50 editing");
    });
});