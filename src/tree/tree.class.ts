import { ThyDragDropEvent } from '../drag-drop/drag-drop.class';
import { ThyTreeNode } from './tree-node.class';

export enum TreeNodeCheckState {
    unchecked = 0,
    checked = 1,
    indeterminate = 2
}

export interface ThyTreeNodeData<T = any> {
    key?: number | string;

    title?: string;

    icon?: string;

    iconStyle?: {
        [key: string]: any;
    };

    children?: ThyTreeNodeData<T>[];

    origin?: any;

    expanded?: boolean;

    disabled?: boolean;

    data?: T;

    [key: string]: any;
}

export interface ThyTreeEmitEvent {
    eventName: string;

    node?: ThyTreeNode;

    event?: Event | any;

    dragNode?: ThyTreeNode;

    targetNode?: ThyTreeNode;
}

export interface ThyTreeDragDropEvent {
    event?: ThyDragDropEvent;

    currentIndex?: number;

    dragNode?: ThyTreeNode;

    targetNode?: ThyTreeNode;

    afterNode?: ThyTreeNode;
}

export class ThyTreeIcons {
    expand?: string;

    collapse?: string;
}
