import InvestorForm from "../../../containers/InvestorForm/InvestorForm";
import React from "react";
import ReactShallowRenderer from "react-test-renderer/shallow";

import { configure } from "enzyme";
import Adapter from "enzyme-adapter-react-16";

configure({ adapter: new Adapter() });
import { render, mount, shallow } from "enzyme";

test("should skip empty input objects", () => {
  const invForm = new InvestorForm();
  const input = {};
  expect(invForm.validateInputConfiguration(input)).toBeFalsy();
});

test("should skip input objects with no type", () => {
  const invForm = new InvestorForm();
  const input = {
    elementType: ""
  };
  expect(invForm.validateInputConfiguration(input)).toBeFalsy();
});

test("should skip input objects with no label", () => {
  const invForm = new InvestorForm();
  const input = {
    elementType: ""
  };
  expect(invForm.validateInputConfiguration(input)).toBeFalsy();
});

test("should skip input objects no checkValidity function", () => {
  const invForm = new InvestorForm();
  const input = {
    elementType: "toggle",
    label: "some-input"
  };
  expect(invForm.validateInputConfiguration(input)).toBeFalsy();
});

test("should validate correctly configured input elements", () => {
  const invForm = new InvestorForm();
  const input = {
    elementType: "toggle",
    label: "some-input",
    checkValidity: () => true
  };
  expect(invForm.validateInputConfiguration(input)).toBeTruthy();
});

test("should render form with tree input fields", () => {
  const renderer = new ReactShallowRenderer();
  renderer.render(<InvestorForm />);
  expect(renderer.getRenderOutput()).toMatchSnapshot();
});

// end to end tests
test("should render one select element and two toggle elements", () => {
  const wrapper = render(<InvestorForm />);
  expect(wrapper.find("select").length).toBe(1);
  expect(wrapper.find("select").get(0).children.length).toBe(7);
  expect(wrapper.find("input").length).toBe(2);
});

test("verify button is disabled", () => {
  const wrapper = render(<InvestorForm />);
  const attr = wrapper.find("button").get(0).attribs;
  expect("disabled" in attr).toBe(true);
});

test("initially there are no validation errors and verify button is disabled", () => {
    const wrapper = mount(<InvestorForm/>);
    expect(wrapper.find(".validation").at(0).text()).toBe('');
    expect(wrapper.find(".validation").at(1).text()).toBe('');
    expect(wrapper.find(".validation").at(2).text()).toBe('');

    const button = wrapper.find("button").at(0);
    expect(button.props().disabled).toBe(true);

    wrapper.find("select").simulate('change', {target: {value: 'ger'}});
    expect(wrapper.find(".validation").at(0).text()).toBe('');
});

test("usa, germany uk are supported countries. Validation message is shown otherwise", () => {
    const wrapper = mount(<InvestorForm/>);
    wrapper.find("select").simulate('change', {target: {value: 'can'}});
    expect(wrapper.find(".validation").at(0).text()).toBe('Ineligible: We don’t currently support investors in Canada.');
    wrapper.find("select").simulate('change', {target: {value: 'usa'}});
    expect(wrapper.find(".validation").at(0).text()).toBe('');
    wrapper.find("select").simulate('change', {target: {value: 'fra'}});
    expect(wrapper.find(".validation").at(0).text()).toBe('Ineligible: We don’t currently support investors in France.');

    const button = wrapper.find("button").at(0);
    expect(button.props().disabled).toBe(true);

    wrapper.find("select").simulate('change', {target: {value: 'ger'}});
    expect(wrapper.find(".validation").at(0).text()).toBe('');
});

test("accredited investors validation message is shown if checkbox is unchecked", () => {
    const wrapper = mount(<InvestorForm/>);
    wrapper.find("input").at(0).simulate('change', {target: {checked: false}});
    expect(wrapper.find(".validation").at(1).text()).toBe('Ineligible: We are only able to accept accredited investors at this time');
    
    const button = wrapper.find("button").at(0);
    expect(button.props().disabled).toBe(true);

    wrapper.find("input").at(0).simulate('change', {target: {checked: true}});
    expect(wrapper.find(".validation").at(1).text()).toBe('');
});

test("ineligible: We must be able to verify your identity", () => {
    const wrapper = mount(<InvestorForm/>);
    wrapper.find("input").at(1).simulate('change', {target: {checked: false}});
    expect(wrapper.find(".validation").at(2).text()).toBe('Ineligible: We must be able to verify your identity');
    
    const button = wrapper.find("button").at(0);
    expect(button.props().disabled).toBe(true);

    wrapper.find("input").at(1).simulate('change', {target: {checked: true}});
    expect(wrapper.find(".validation").at(2).text()).toBe('');
}); 

test("all inputs must have valid values.", () => {
    const wrapper = mount(<InvestorForm/>);
    wrapper.find("select").simulate('change', {target: {value: 'usa'}});
    wrapper.find("input").at(0).simulate('change', {target: {checked: false}});
    wrapper.find("input").at(1).simulate('change', {target: {checked: true}});

    const button = wrapper.find("button").at(0);
    expect(button.props().disabled).toBe(true);

    wrapper.find("select").simulate('change', {target: {value: 'usa'}});
    wrapper.find("input").at(0).simulate('change', {target: {checked: true}});
    wrapper.find("input").at(1).simulate('change', {target: {checked: false}});

    expect(button.props().disabled).toBe(true);

    wrapper.find("select").simulate('change', {target: {value: 'can'}});
    wrapper.find("input").at(0).simulate('change', {target: {checked: true}});
    wrapper.find("input").at(1).simulate('change', {target: {checked: true}});

    expect(button.props().disabled).toBe(true);
}); 

test("with valid inputs verify button is enabled.", () => {
    const wrapper = mount(<InvestorForm/>);
    wrapper.find("select").simulate('change', {target: {value: 'usa'}});
    wrapper.find("input").at(0).simulate('change', {target: {checked: true}});
    wrapper.find("input").at(1).simulate('change', {target: {checked: true}});

    const button = wrapper.find("button").at(0);
    expect(button.props().disabled).toBe(false);
}); 