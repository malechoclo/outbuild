import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";

import App from "../App";
const delayTime = 200;
const addButtonId = '#add-button';
const editSaveButtonId = '#edit-save-button';
const deleteTaskBtnId = '#delete-task-btn';
const editTaskBtnId = '#edit-task-btn';
const editFormId = '#edit-form';
const createFormId = '#create-form';
const { container } = render(<App />);
render(<App />);
describe("Task Management Application", () => {
    test("should create a task and display it in the TODO column", () => {


        waitFor(() => {
            const descriptionInput = screen.getByLabelText("Task description");
            const urgencySelect = screen.getByLabelText("Select urgency");
            const deadlineInput = screen.getByLabelText("Deadline");
            const addButton = screen.getByText("Add Task");
        }, delayTime);
        waitFor(() => {

            fireEvent.change(descriptionInput[0], { target: { value: "New_Task" } });
            fireEvent.change(urgencySelect[0], { target: { value: "medium" } });
            fireEvent.change(deadlineInput[0], { target: { value: "2024-12-12" } });
            const createForm = screen.getByTestId(createFormId);

        }, delayTime);
        waitFor(() => {
            fireEvent.click(addButton);
            fireEvent.submit(createForm, { preventDefault: jest.fn() });
        }, delayTime);
        waitFor(() => {

            const taskElement = screen.getByText("New_Task");
            expect(taskElement).toBeInTheDocument();
            expect(taskElement).toHaveTextContent("New Task");

            expect(descriptionInput.value).toBe("");
            expect(urgencySelect.value).toBe("");
            expect(deadlineInput.value).toBe("");
        }, delayTime);



    });

    test("should edit the description of a task with text 'New_Task'", async () => {




        waitFor(() => {
            const descriptionInput = screen.findAllByText("Task description");
            const urgencySelect = screen.getByText("Select urgency");
            const deadlineInput = screen.getByLabelText("Deadline");
            const addButton = screen.getByText("Add Task");
        }, delayTime);
        waitFor(() => {
            fireEvent.change(descriptionInput, { target: { value: "New_Task" } });
            fireEvent.change(urgencySelect, { target: { value: "medium" } });
            fireEvent.change(deadlineInput, { target: { value: "2024-12-12" } });
            const createForm = screen.getByTestId(createFormId);
            fireEvent.submit(createForm, { preventDefault: jest.fn() });
            fireEvent.click(addButton);
        }, delayTime);


        waitFor(() => {
            const taskElement = screen.getByText("New_Task");
            expect(taskElement).toBeInTheDocument();
        }, delayTime);


        waitFor(() => {
            const editButton = screen.getByTestId(editSaveButtonId)
            fireEvent.click(editButton);
        }, delayTime);

        waitFor(() => {
            const editContentInput = screen.getByLabelText("Edit Content");
            fireEvent.change(editContentInput, { target: { value: "Updated_Task" } });
        }, delayTime);

        waitFor(() => {
            const saveButton = screen.getByTestId(addButtonId)
            fireEvent.click(saveButton);
        }, delayTime);
        waitFor(() => {

            expect(screen.getByText("Updated_Task")).toBeInTheDocument();
            expect(screen.queryByText("New_Task")).not.toBeInTheDocument();
        }, delayTime);

    });


    test("should remove task with text 'New_Task'", async () => {

        let createForm = undefined;

        waitFor(() => {
            const descriptionInput = screen.getByPlaceholderText("Task description");
            const urgencySelect = screen.getByText("Select urgency");
            const deadlineInput = screen.getByLabelText("Deadline");
            const addButton = screen.getByText("Add Task");
        }, delayTime);
        waitFor(() => {
            createForm = screen.getByTestId(createFormId);
        }, delayTime);
        waitFor(() => {
            fireEvent.change(descriptionInput, { target: { value: "New_Task" } });
            fireEvent.change(urgencySelect, { target: { value: "medium" } });
            fireEvent.change(deadlineInput, { target: { value: "2024-12-12" } });
        }, delayTime);
        waitFor(() => {
            fireEvent.submit(createForm, { preventDefault: jest.fn() });
            fireEvent.click(addButton);
        }, delayTime);


        waitFor(() => {
            const taskElement = screen.getByText("New_Task");
            expect(taskElement).toBeInTheDocument();
        }, delayTime);


        waitFor(() => {
            const deleteButton = screen.getByTestId(deleteTaskBtnId);
            const editForm = screen.getByTestId(editFormId);
            fireEvent.click(deleteButton);
            fireEvent.submit(editForm, { preventDefault: jest.fn() });
        }, delayTime);

        waitFor(() => {

            expect(screen.queryByText("New_Task")).not.toBeInTheDocument();
        }, delayTime);


    });


    test("should move a task from one column to another", async () => {





        waitFor(() => {
            const descriptionInput = screen.getByPlaceholderText("Task description");
            const urgencySelect = screen.getByText("Select urgency");
            const deadlineInput = screen.getByLabelText("Deadline");
            const addButton = screen.getByText("Add Task");
        }, delayTime);
        waitFor(() => {
            fireEvent.change(descriptionInput, { target: { value: "Task to Move" } });
            fireEvent.change(urgencySelect, { target: { value: "medium" } });
            fireEvent.change(deadlineInput, { target: { value: "2024-12-12" } });
            fireEvent.click(addButton);
        }, delayTime);


        waitFor(() => {
            const taskElement = screen.getByText("Task to Move");
            expect(taskElement).toBeInTheDocument();
        }, delayTime);


        let sourceColumn = undefined;;
        let targetColumn = undefined;;
        waitFor(() => {
            sourceColumn = screen.getByText("TODO").parentElement;
            targetColumn = screen.getByText("IN PROGRESS").parentElement;


            fireEvent.dragStart(taskElement);
            fireEvent.dragOver(targetColumn);
            fireEvent.drop(targetColumn);
        }, delayTime);
        waitFor(() => {

            expect(sourceColumn).not.toHaveTextContent("Task to Move");


            expect(targetColumn).toHaveTextContent("Task to Move");
        }, delayTime);

    });
});