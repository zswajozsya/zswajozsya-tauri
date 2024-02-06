import { defineStore } from "pinia";

type State = {
    isDirectoryLabelEditorVisible: boolean,
    isFileLabelEditorVisible: boolean,
};

export const useDialogStore = defineStore("dialog", {
    state: () => {
        return {
            isDirectoryLabelEditorVisible: false,
            isFileLabelEditorVisible: false,
        } satisfies State as State;
    }
});
