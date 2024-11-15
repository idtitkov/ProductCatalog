import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AppState } from './app.state';
import { productReducer } from './product/product.reducer';
import { categoryReducer } from './category/category.reducer';
import { CategoryEffects } from './category/category.effects';
import { ProductEffects } from './product/product.effects';
import { userReducer } from './user/user.reducer';
import { UserEffects } from './user/user.effects';


@NgModule({
    imports: [
        StoreModule.forRoot<AppState>({
            products: productReducer,
            categories: categoryReducer,
            users: userReducer,
        }),
        EffectsModule.forRoot([
            CategoryEffects,
            ProductEffects,
            UserEffects
        ]),
        StoreDevtoolsModule.instrument({
            maxAge: 25,
            logOnly: false,
        })
    ],
    exports: [
        StoreModule,
        EffectsModule
    ]
})
export class AppStoreModule { }
