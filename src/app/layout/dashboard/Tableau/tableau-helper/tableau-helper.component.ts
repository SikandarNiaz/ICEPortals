import {
  Component,
  OnInit,
  AfterViewChecked,
  Input,
  ViewChild,
} from "@angular/core";
import { DashboardService } from "../../dashboard.service";
import { Router, ActivatedRoute } from "@angular/router";
import { DashboardDataService } from "../../dashboard-data.service";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";

declare var tableau: any;

@Component({
  selector: "tableau-helper",
  templateUrl: "./tableau-helper.component.html",
  styleUrls: ["./tableau-helper.component.scss"],
})
export class TableauHelperComponent implements OnInit {
  ticketUrl: string;
  params: any = {};
  @Input() type;
  @Input() cluster;
  constructor(
    private toastr: ToastrService,
    private httpService: DashboardService,
    public router: Router,
    private dataService: DashboardDataService,
    public activatedRoute: ActivatedRoute,
    private readonly location: Location
  ) {
    this.activatedRoute.params.subscribe((p) => {
      this.params = p;
    });
  }

  ngOnInit(): void {
    this.getKey();
    // this.location.replaceState("/dashboard/tableau/");
  }
  getKey() {
    const obj = {
      type: this.type,
      userType: localStorage.getItem("user_type"),
    };
    this.httpService.getKey(obj).subscribe((data: any) => {
      // if (this.params.key) {
      //   this.ticketUrl = `${data.TableauData.tableau_url}/${data.ticket}/${this.params.key}/${this.params.key1}/${this.params.key2}?iframeSizedToWindow=${data.TableauData.iframe}&:embed=${data.TableauData.embed}&:showAppBanner=${data.TableauData.showAppBanner}&:display_count=${data.TableauData.display_count}&:showVizHome=${data.TableauData.showVizHome}`;
      // } else {
      if (this.cluster != null && this.cluster != "") {
        this.ticketUrl = `${data.TableauData.tableau_url}/${data.ticket}/${data.tableauPath}&cluster_parameter=${this.cluster}?iframeSizedToWindow=${data.TableauData.iframe}&:embed=${data.TableauData.embed}&:showAppBanner=${data.TableauData.showAppBanner}&:display_count=${data.TableauData.display_count}&:showVizHome=${data.TableauData.showVizHome}`;
      } else {
        this.ticketUrl = `${data.TableauData.tableau_url}/${data.ticket}/${data.tableauPath}?iframeSizedToWindow=${data.TableauData.iframe}&:embed=${data.TableauData.embed}&:showAppBanner=${data.TableauData.showAppBanner}&:display_count=${data.TableauData.display_count}&:showVizHome=${data.TableauData.showVizHome}`;
      }
      // }
      console.log("url:", this.ticketUrl);
      this.initViz();
    });
  }

  initViz() {
    const containerDiv = document.getElementById("vizContainer"),
      url = this.ticketUrl,
      options = {
        hideTabs: true,
        onFirstInteractive: function () {},
      };
    const viz = new tableau.Viz(containerDiv, url, options);
  }
}
