import { defineStore } from "pinia";

type State = {
    isDirectoryLabelEditorVisible: boolean,
};

export const useDialogStore = defineStore("dialog", {
    state: () => {
        return {
            isDirectoryLabelEditorVisible: false,
        } satisfies State as State;
    }
});
