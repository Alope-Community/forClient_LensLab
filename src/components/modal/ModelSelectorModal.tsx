import { useTranslation } from "react-i18next";

type ModelType = "model1_female" | "model2_male" | "model3_milkchocolate" | "model4_serum" | "model5_cosmetic";

type ModelItem = {
    readonly id: ModelType;
    readonly name: string;
    readonly thumbnail: string;
};

type ModelSelectorModalProps = {
    isOpen: boolean;
    onClose: () => void;
    modelsList: readonly ModelItem[];
    selectedModel: ModelType;
    onSelectModel: (id: ModelType) => void;
};

export function ModelSelectorModal({
    isOpen,
    onClose,
    modelsList,
    selectedModel,
    onSelectModel,
}: ModelSelectorModalProps) {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            <div className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-xl p-6 shadow-2xl z-10 max-h-[90vh] overflow-y-auto custom-scrollbar animate-scale-in">
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-3">
                    <div>
                        <h3 className="text-base font-semibold text-white">
                            {t("selectModelScene")}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                            Pilih objek 3D subjek utama untuk simulasi studio foto
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-white/5 transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {modelsList.map((model) => {
                        const isSelected = selectedModel === model.id;
                        return (
                            <button
                                key={model.id}
                                type="button"
                                onClick={() => {
                                    onSelectModel(model.id);
                                    onClose();
                                }}
                                className={`group relative flex flex-col items-stretch text-left rounded-lg p-2 border transition-all cursor-pointer overflow-hidden ${isSelected
                                        ? "bg-primary/10 border-primary shadow-lg shadow-primary/10"
                                        : "bg-neutral border-white/5 hover:border-white/20 hover:bg-white/[0.02]"
                                    }`}
                            >
                                <div className="aspect-square w-full rounded-md bg-black/40 overflow-hidden mb-3 relative border border-white/5">
                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-700/20 to-gray-900/40 flex items-center justify-center text-[10px] text-gray-500">
                                        3D Preview
                                    </div>
                                    <img
                                        src={model.thumbnail}
                                        alt={t(model.name)}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                        onError={(e) => {
                                            (e.target as HTMLElement).style.display = "none";
                                        }}
                                    />

                                    {isSelected && (
                                        <div className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full shadow-md">
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>

                                <span
                                    className={`text-xs font-medium px-1 truncate ${isSelected ? "text-primary font-bold" : "text-gray-300 group-hover:text-white"
                                        }`}
                                >
                                    {t(model.name)}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}