(function registerHighlightButton() {
    const runtime = window.ExamRuntime;
    if (!runtime) {
        console.error("ExamRuntime must be initialized before HighlightButton.");
        return;
    }

    runtime.register("HighlightButton", () => {
        const { useHighlight } = runtime.resolve("HighlightContext");

        function HighlightButton({ customIcon, useImage = true, hidden = false }) {
            const { highlightEnabled, toggleHighlight } = useHighlight();

            // Don't render if hidden
            if (hidden) {
                return null;
            }

            // Determine if we should show image or text
            const showImage = customIcon && useImage;

            return (
                <button
                    type="button"
                    onClick={toggleHighlight}
                    className={showImage ? "clearcoat-button" : "clearcoat-button-default"}
                    title={highlightEnabled ? "Disable Highlight" : "Enable Highlight"}
                >
                    {showImage ? (
                        <img
                            src={customIcon}
                            alt="Highlight"
                            className="button-skin"
                            draggable={false}
                            onDragStart={(e) => e.preventDefault()}
                        />
                    ) : (
                        <span style={{ 
                            color: highlightEnabled ? '#4CAF50' : '#ffffff',
                            fontWeight: highlightEnabled ? 'bold' : 'normal',
                            fontSize: '12px',
                            padding: '0 8px'
                        }}>
                            {highlightEnabled ? 'HIGHLIGHT ON' : 'HIGHLIGHT'}
                        </span>
                    )}
                </button>
            );
        }

        return HighlightButton;
    });
})();
