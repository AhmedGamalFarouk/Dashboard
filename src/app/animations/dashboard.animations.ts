import {
    trigger,
    transition,
    style,
    animate,
    query,
    stagger
} from '@angular/animations';

/**
 * Stagger fade-in animation for list items
 */
export const listAnimation = trigger('listAnimation', [
    transition('* => *', [
        query(':enter', [
            style({ opacity: 0, transform: 'translateY(15px)' }),
            stagger('50ms', [
                animate('250ms ease-out',
                    style({ opacity: 1, transform: 'translateY(0)' })
                )
            ])
        ], { optional: true })
    ])
]);

/**
 * Fade animation for modals and overlays
 */
export const fadeAnimation = trigger('fadeAnimation', [
    transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 1 }))
    ]),
    transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0 }))
    ])
]);

/**
 * Slide up animation for modals
 */
export const slideUpAnimation = trigger('slideUpAnimation', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(20px)' }))
    ])
]);
