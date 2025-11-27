(function registerCustomButton() {
    const runtime = window.ExamRuntime;
    if (!runtime) {
        console.error("ExamRuntime must be initialized before CustomButton.");
        return;
    }

    runtime.register("CustomButton", () => {
        const { useEffect, useRef } = React;

        function CustomButton({
            buttonKey,
            defaultLabel,
            onClick,
            disabled,
            className = "",
            children,
            ...rest
        }) {
            const buttonRef = useRef(null);

            useEffect(() => {
                const el = buttonRef.current;
                if (!el || typeof window.renderExamButton !== "function") return;

                function applyTheme() {
                    window.renderExamButton(
                        buttonKey,
                        defaultLabel,
                        el,
                        onClick
                    );
                    el.disabled = !!disabled;
                }

                applyTheme();
                window.addEventListener("buttonThemeUpdated", applyTheme);

                return () => {
                    window.removeEventListener("buttonThemeUpdated", applyTheme);
                };
            }, [buttonKey, defaultLabel, onClick, disabled]);

            return (
                <button
                    ref={buttonRef}
                    type="button"
                    disabled={disabled}
                    className={className}
                    {...rest}
                >
                    {children || defaultLabel || ""}
                </button>
            );
        }

        return CustomButton;
    });
})();
