(function registerHighlightContext() {
    const runtime = window.ExamRuntime;
    if (!runtime) {
        console.error("ExamRuntime must be initialized before HighlightContext.");
        return;
    }

    runtime.register("HighlightContext", () => {
        const { createContext, useContext, useMemo, useState, useCallback } = React;

        const HighlightContext = createContext({
            highlightEnabled: false,
            toggleHighlight: () => {}
        });

        function HighlightProvider({ children }) {
            const [highlightEnabled, setHighlightEnabled] = useState(false);

            const toggleHighlight = useCallback(() => {
                setHighlightEnabled((prev) => !prev);
            }, []);

            const value = useMemo(
                () => ({ highlightEnabled, toggleHighlight }),
                [highlightEnabled, toggleHighlight]
            );

            return (
                <HighlightContext.Provider value={value}>
                    {children}
                </HighlightContext.Provider>
            );
        }

        function useHighlight() {
            return useContext(HighlightContext);
        }

        return { HighlightContext, HighlightProvider, useHighlight };
    });
})();







