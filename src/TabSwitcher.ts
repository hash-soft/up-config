export class TabSwitcher {
  private _currentIndex = 0;
  private _tabTexts!: NodeListOf<HTMLElement>;
  private _tabContents!: NodeListOf<HTMLElement>;
  constructor(private _prefixName: string) {}

  setup() {
    this._tabTexts = document.getElementsByName(this._prefixName + "-text");
    this._tabTexts.forEach((tab, index) => {
      tab.addEventListener("click", (event) => {
        this._onTabSwitch(event, index);
      });
    });
    this._tabContents = document.getElementsByName(
      this._prefixName + "-content"
    );
  }

  private _onTabSwitch(e: Event, index: number) {
    console.log(index);
    console.log(e);
    this._tabTexts[this._currentIndex].classList.remove(
      "text-blue-500",
      "border-b-2",
      "font-medium",
      "border-blue-500"
    );
    this._tabTexts[index].classList.add(
      "text-blue-500",
      "border-b-2",
      "font-medium",
      "border-blue-500"
    );
    this._tabContents[this._currentIndex].classList.add("hidden");
    this._tabContents[index].classList.remove("hidden");
    this._currentIndex = index;
  }
}
