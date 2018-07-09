import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";
import InputElement from "../../../components/InputElement/InputElement";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
import { shallow } from "enzyme";

const countries = [
  {
    value: "usa",
    supportedCountry: true,
    displayName: "United States of America",
    selected: false
  },
  {
    value: "ger",
    supportedCountry: true,
    displayName: "Germany",
    selected: false
  },
  {
    value: "fra",
    supportedCountry: false,
    displayName: "France",
    selected: false
  },
  {
    value: "uk",
    supportedCountry: true,
    displayName: "United Kingdom",
    selected: false
  },
  {
    value: "hol",
    supportedCountry: false,
    displayName: "Netherlands",
    selected: false
  },
  {
    value: "can",
    supportedCountry: false,
    displayName: "Canada",
    selected: false
  }
];
const elementConfig = {
  options: countries,
  hasEmptyOption: false
};

test("should skip not properly configured inputs", () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<InputElement />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

test("should render correctly configured inputs", () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(
    <InputElement
      key={"some-field"}
      elementType={"some-type"}
      label={"some-field"}
      value={false}
      invalid={false}
      validationMessage={"some-validation-message"}
      touched={false}
      changed={event => true}
    />
  );
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

test("type select renders all options", () => {
  const wrapper = shallow(
    <InputElement
      key={"some-field"}
      elementType={"select"}
      elementConfig={elementConfig}
      label={"some-field"}
      value={false}
      invalid={false}
      validationMessage={"some-validation-message"}
      touched={false}
      changed={event => true}
    />
  );
  expect(wrapper.find("select").length).toBe(1);
  expect(wrapper.find("option").length).toBe(6);
});

test("type select adds empty option", () => {
  const config = { ...elementConfig, hasEmptyOption: true };
  const wrapper = shallow(
    <InputElement
      key={"some-field"}
      elementType={"select"}
      elementConfig={config}
      label={"some-field"}
      value={false}
      invalid={false}
      validationMessage={"some-validation-message"}
      touched={false}
      changed={event => true}
    />
  );
  expect(wrapper.find("select").length).toBe(1);
  expect(wrapper.find("option").length).toBe(7);
});

test("type toggle renders only one input", () => {
  const wrapper = shallow(
    <InputElement
      key={"some-field"}
      elementType={"toggle"}
      elementConfig={{}}
      label={"some-field"}
      value={true}
      invalid={false}
      validationMessage={"some-validation-message"}
      touched={false}
      changed={event => true}
    />
  );
  expect(wrapper.find("input").length).toBe(1);
});

