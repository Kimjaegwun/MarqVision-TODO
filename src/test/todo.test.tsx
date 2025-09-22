import { renderWithClient, screen, waitFor } from "@/test/query";
import userEvent from "@testing-library/user-event";
import { expect, test, describe } from "@jest/globals";
import Home from "@/app/page";

describe("테스트1: 할일 추가", () => {
  test("인풋에 테스트 입력 후 추가 버튼 클릭 시 할일이 추가되고 인풋이 초기화된다", async () => {
    renderWithClient(<Home />);

    const input = screen.getByLabelText("task-input");
    const addButton = screen.getByLabelText("task-add-button");

    await userEvent.type(input, "테스트 입력");
    await userEvent.click(addButton);

    await screen.findAllByLabelText("task-textarea");
    await waitFor(() => expect((input as HTMLInputElement).value).toBe(""));

    const textareas = await screen.findAllByLabelText("task-textarea");
    expect(textareas.some((el) => (el as HTMLTextAreaElement).value === "테스트 입력")).toBe(true);
  });
});

describe("테스트2: 할일 수정", () => {
  test("할일 수정 버튼 클릭 시 할일이 수정된다", async () => {
    renderWithClient(<Home />);

    const input = screen.getByLabelText("task-input");
    const addButton = screen.getByLabelText("task-add-button");
    await userEvent.type(input, "테스트 입력");
    await userEvent.click(addButton);

    const editButton = screen.getByLabelText("edit-button");
    await userEvent.click(editButton);

    const saveButton = await screen.findByLabelText("save-button");

    const editInput = screen.getByLabelText("task-textarea");
    await userEvent.clear(editInput);
    await userEvent.type(editInput, "테스트 수정");

    await userEvent.click(saveButton);

    const updated = await screen.findAllByLabelText("task-textarea");
    expect(updated.some((el) => (el as HTMLTextAreaElement).value === "테스트 수정")).toBe(true);
  });
});

describe("테스트3: 할일 삭제", () => {
  test("할일 삭제 버튼 클릭 시 할일이 삭제된다", async () => {
    renderWithClient(<Home />);

    const input = screen.getByLabelText("task-input");
    const addButton = screen.getByLabelText("task-add-button");
    await userEvent.type(input, "삭제 테스트");
    await userEvent.click(addButton);

    const textareas = await screen.findAllByLabelText("task-textarea");
    const idx = textareas.findIndex((el) => (el as HTMLTextAreaElement).value === "삭제 테스트");

    const deleteButtons = screen.getAllByLabelText("delete-button");
    await userEvent.click(deleteButtons[idx]);

    await waitFor(() => {
      expect(screen.queryByDisplayValue("삭제 테스트")).toBeNull();
    });
  });
});
