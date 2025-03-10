export interface SectionType {
    sectionId: number;
    iconUrl: string;
    sectionName: string;
    estimateTime: string;
    progress: number;
    isLocked: boolean;
    order: number;
}

export interface SectionContentType {
    sc_id: number;
    title: string;
    description: string;
    icon_url: string;
    iframe_url: string;
    isLocked: boolean;
    order: number;
}
