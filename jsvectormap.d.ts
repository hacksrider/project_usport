declare module 'jsvectormap' {
    interface JsVectorMapOptions {
        selector: string;
        map: string;
        zoomButtons?: boolean;
        regionStyle?: Record<string, unknown>;
        regionLabelStyle?: Record<string, unknown>;
        labels?: {
            regions?: {
                render?: (code: string) => string;
            };
        };
    }

    class JsVectorMap {
        constructor(options: JsVectorMapOptions);
        destroy(): void;
    }

    export default JsVectorMap;
}
