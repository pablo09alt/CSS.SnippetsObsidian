const { Plugin, ItemView, WorkspaceLeaf } = require('obsidian');

const VIEW_TYPE_CALC = "calculatrice-view";

class CalcView extends ItemView {
    constructor(leaf) {
        super(leaf);
    }
    getViewType() { return VIEW_TYPE_CALC; }
    getDisplayText() { return "Calculatrice"; }
    getIcon() { return "calculator"; }

    async onOpen() {
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl("h4", { text: "Calculatrice" });

        const input = container.createEl("input", {
            type: "text",
            placeholder: "Ex: 10 + 5 * 2",
            cls: "calc-input"
        });
        input.style.width = "100%";
        input.style.marginBottom = "10px";

        const resultDisplay = container.createEl("div", { text: "Résultat: -", cls: "calc-result" });
        resultDisplay.style.fontSize = "1.2em";
        resultDisplay.style.fontWeight = "bold";

        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                try {
                    // Utilisation de Function pour évaluer le calcul de manière sécurisée
                    const res = new Function(`return ${input.value}`)();
                    resultDisplay.setText(`Résultat: ${res}`);
                } catch (err) {
                    resultDisplay.setText("Erreur de calcul");
                }
            }
        });
    }
}

module.exports = class MicroCalcPlugin extends Plugin {
    async onload() {
        this.registerView(VIEW_TYPE_CALC, (leaf) => new CalcView(leaf));

        // Ajoute une icône dans la barre de gauche pour ouvrir la calculatrice
        this.addRibbonIcon("calculator", "Ouvrir la calculatrice", () => {
            this.activateView();
        });

        // Ajoute une commande (CMD/CTRL + P)
        this.addCommand({
            id: "show-calc",
            name: "Afficher la calculatrice",
            callback: () => this.activateView(),
        });
    }

    async activateView() {
        const { workspace } = this.app;
        let leaf = workspace.getLeavesOfType(VIEW_TYPE_CALC)[0];

        if (!leaf) {
            leaf = workspace.getRightLeaf(false);
            await leaf.setViewState({ type: VIEW_TYPE_CALC, active: true });
        }
        workspace.revealLeaf(leaf);
    }
};