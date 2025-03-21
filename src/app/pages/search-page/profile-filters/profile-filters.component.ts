import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ProfileService } from '../../../data/services/profile.service';
import { debounceTime, startWith, Subscription, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-profile-filters',
    imports: [ReactiveFormsModule],
    templateUrl: './profile-filters.component.html',
    styleUrl: './profile-filters.component.scss'
})
export class ProfileFiltersComponent implements OnDestroy {
    profileService = inject(ProfileService);
    fb = inject(FormBuilder);

    searchForm = this.fb.group({
        firstName: [''],
        lastName: [''],
        stack: ['']
    });

    searchFormSubscription: Subscription;

    constructor() {
        this.searchFormSubscription = this.searchForm.valueChanges
            .pipe(
                startWith({}),
                debounceTime(300),
                switchMap(formValue => {
                    return this.profileService.filterProfiles(formValue)
                }),
                takeUntilDestroyed()
            ).subscribe();
    }

    ngOnDestroy() {
        this.searchFormSubscription.unsubscribe();
    }
}
