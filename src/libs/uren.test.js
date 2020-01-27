const { Uren } = require("./uren");

describe("Rendering should work", () => {
  it("Should render data-bind", () => {
    document.body.innerHTML = `<div data-bind="count"></div>`;
    new Uren().render({ count: 123 });
    expect(document.body.innerHTML).toBe(`<div data-bind="count">123</div>`);
  });

  it("Should render data-attrs", () => {
    document.body.innerHTML = `<button data-attrs="{disabled: isDisabled, hidden: isHidden}"></button>`;
    new Uren().render({ isDisabled: true, isHidden: false });
    expect(document.body.innerHTML).toBe(
      `<button data-attrs="{disabled: isDisabled, hidden: isHidden}" disabled=""></button>`
    );
  });

  it("Should render data-if", () => {
    document.body.innerHTML = `<div data-if="isShown"></div>`;
    new Uren().render({ isShown: false });
    expect(document.body.innerHTML).toBe(
      `<div data-if="isShown" hidden=""></div>`
    );
  });
});

// <span>Message: {{ msg }}</span>
// <div v-bind:id="dynamicId"></div>
// <p v-if="seen">Now you see me</p>
// <a v-on:click="doSomething"> ... </a>
// <div v-bind:class="{ active: isActive }"></div>

// <ul id="example-1">
//   <li v-for="item in items">
//     {{ item.message }}
//   </li>
// </ul>
