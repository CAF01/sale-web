declare var $: any;
export class RedirectHelper {
  public static NextTab(rootId: string, tabId: string) {
    $(rootId + ' a[href="' + tabId + '"]').tab('show');
  }
}
