import { ViewContainerRef, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
export declare const CALENDAR_VALUE_ACCESSOR: any;
export declare class DatePickerComponent implements ControlValueAccessor, OnInit {
    class: string;
    expanded: boolean;
    opened: boolean;
    format: string;
    viewFormat: string;
    firstWeekdaySunday: boolean;
    private date;
    private onChange;
    private onTouched;
    private el;
    private viewDate;
    private days;
    private onTouchedCallback;
    private onChangeCallback;
    constructor(viewContainerRef: ViewContainerRef);
    value: any;
    ngOnInit(): void;
    generateCalendar(): void;
    selectDate(e: MouseEvent, i: number): void;
    prevMonth(): void;
    nextMonth(): void;
    writeValue(value: any): void;
    registerOnChange(fn: any): void;
    registerOnTouched(fn: any): void;
    toggle(): void;
    open(): void;
    close(): void;
}
