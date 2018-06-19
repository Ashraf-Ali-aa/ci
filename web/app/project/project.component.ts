import 'rxjs/add/operator/switchMap';

import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, ParamMap} from '@angular/router';

import {Breadcrumb} from '../common/components/toolbar/toolbar.component';
import {Project} from '../models/project';
import {DataService} from '../services/data.service';
import { BuildSummary } from '../models/build_summary';
import { MatTable } from '@angular/material';

@Component({
  selector: 'fci-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  @ViewChild('buildsTable') table: MatTable<BuildSummary>;
  readonly DISPLAYED_COLUMNS: string[] =
      ['number', 'started', 'duration', 'branch', 'sha'];
  isLoading = true;
  project: Project;
  readonly breadcrumbs: Breadcrumb[] =
      [{label: 'Dashboard', url: '/'}, {hint: 'Project'}];

  constructor(
      private readonly dataService: DataService,
      private readonly route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap
        .switchMap(
            (params: ParamMap) => this.dataService.getProject(params.get('id')))
        .subscribe((project) => {
          this.project = project;
          this.updateBreadcrumbs(this.project.name);
          this.isLoading = false;
        });
  }

  rebuild(buildNumber: number) {
    this.dataService.rebuild(this.project.id, buildNumber).subscribe((newBuild) => {
      this.project.builds.unshift(newBuild);
      // Need to re-render rows now that new data is added.
      this.table.renderRows();
    });
  }

  private updateBreadcrumbs(projectName: string) {
    this.breadcrumbs[1].label = projectName;
  }
}
