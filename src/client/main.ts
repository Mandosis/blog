import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Angular 2 Universal
import { UniversalModule } from 'angular2-universal';

// App
import { AppComponent } from './app/app.component';
import { HomeComponent } from './app/home/home.component';

// Dashboard Site Components
import { DashboardComponent } from './app/dashboard/dashboard.component';
import { DashboardHomeComponent } from './app/dashboard-home/dashboard-home.component';
import { EditorComponent } from './app/editor/editor.component';
import { LoginComponent } from './app/login/login.component';

// Pipes
import { MarkdownPipe } from './app/markdown.pipe';
import { SpeakingurlPipe } from './app/speakingurl.pipe';
import { WordCountPipe } from './app/word-count.pipe';
import { PrismPipe } from './app/prism.pipe';

// Services
import { UserService } from './app/user.service.ts'

// Routing
import { routing } from './app/app.routing';

// Modules
import { CodeEditorModule } from './app/code-editor/code-editor.module';

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    UniversalModule,
    FormsModule,
    routing,
    CodeEditorModule,
  ],
  declarations: [
    // Components
    AppComponent,
    HomeComponent,
    DashboardComponent,
    DashboardHomeComponent,
    EditorComponent,
    LoginComponent,

    // Pipes
    MarkdownPipe,
    SpeakingurlPipe,
    WordCountPipe,
    PrismPipe

  ],
  providers: [
    UserService
  ]
})

export class MainModule {

};
