import React, { Component } from "react";
import classes from "./InvestorForm.css";
import InputElement from "../../components/InputElement/InputElement";
import Button from "../../components/Button/Button";

class InvestorForm extends Component {
  countries = [
    { value: "usa",  supportedCountry: true, displayName: "United States of America", selected: false },
    { value: "ger", supportedCountry: true, displayName: "Germany", selected: false },
    { value: "fra", supportedCountry: false, displayName: "France", selected: false },
    { value: "uk", supportedCountry: true, displayName: "United Kingdom", selected: false },
    { value: "hol", supportedCountry: false, displayName: "Netherlands", selected: false },
    { value: "can", supportedCountry: false, displayName: "Canada", selected: false }
  ];
  
  state = {
    investorForm: {
      country: {
        elementType: "select",
        elementConfig: {
          options: this.countries,
          hasEmptyOption: true
        },
        value: "",
        label: "Country of citizenship",
        touched: false,
        required: true,
        valid: false,
        validationMessage: "initial",
        checkValidity: element => {
          const country = this.countries.find(item => item.value === element.value);
          const result = element.value === "usa" || (country && country.supportedCountry);
          if(!result){
            if(!country){
              element.validationMessage = `Ineligible: Please select your country.`;
            }else{
              element.validationMessage = `Ineligible: We don’t currently support investors in ${country.displayName}.`;
            }
          } else{
            element.validationMessage = "";
          }
          return result;
        }
      },
      accredited: {
        elementType: "toggle",
        elementConfig: {
          checked:false
        },
        value: false,
        label: "Are you an accredited investor?",
        touched: false,
        required: true,
        valid: false,
        validationMessage: "initial",
        checkValidity: element => {
          if(!element.value){
            element.validationMessage = "Ineligible: We are only able to accept accredited investors at this time";
          } else {
            element.validationMessage = "";
          }
          return element.value;
        }
      },
      identityProof: {
        elementType: "toggle",
        elementConfig: {
          checked: false
        },
        value: false,
        label: "Can you provide proof of identity?",
        touched: false,
        required: true,
        valid: false,
        validationMessage: "initial",
        checkValidity: element => {
          if(!element.value){
            element.validationMessage = "Ineligible: We must be able to verify your identity";
          } else {
            element.validationMessage = "";
          }
          return element.value;
        }
      }
    },
    isFormValid: false,
    isLoading: false
  };

  validateInputConfiguration(inputConfiguration) {
    return inputConfiguration.elementType 
      && inputConfiguration.label 
      && inputConfiguration.checkValidity && typeof inputConfiguration.checkValidity === 'function';
  }

  onInputChanged = (event, inputId) => {

    const updatedInvestorForm = { ...this.state.investorForm };
    const updatedFormElement = { ...this.state.investorForm[inputId] };

    updatedFormElement.value =
      updatedFormElement.elementType === "toggle"
        ? event.target.checked
        : event.target.value;
        
    updatedFormElement.valid = updatedFormElement.checkValidity(updatedFormElement);
    updatedFormElement.touched = true;

    updatedInvestorForm[inputId] = updatedFormElement;

    let formIsValid = true;
    for (const key in updatedInvestorForm) {
      formIsValid = updatedInvestorForm[key].valid && updatedInvestorForm[key].touched && formIsValid;
    }

    this.setState({ investorForm: updatedInvestorForm, isFormValid: formIsValid });
  };

  render() {
    const formElements = [];
    for (const key in this.state.investorForm) {
      const inputConfiguration = this.state.investorForm[key];
      if(this.validateInputConfiguration(inputConfiguration)){
        if(!formElements.find(item=>item.key === key)){
          formElements.push({
            id: key,
            configuration: inputConfiguration
          });
        }
      }
    }

    let formToBeRendered = (
      <form>
        {formElements.map(formElement => (
          <InputElement
            key={formElement.id}
            elementType={formElement.configuration.elementType}
            label={formElement.configuration.label}
            value={formElement.configuration.value}
            elementConfig={formElement.configuration.elementConfig}
            invalid={!formElement.configuration.valid}
            validationMessage={formElement.configuration.validationMessage}
            touched={formElement.configuration.touched}
            changed={event => this.onInputChanged(event, formElement.id)}
          />
        ))}
        <Button btnType="Success" disabled={!this.state.isFormValid}>
          VERIFY
        </Button>
      </form>
    );

    if (this.state.isLoading) {
      formToBeRendered = <p>Loading form...</p>;
    }

    return <div className={classes.InvestorForm}>{formToBeRendered}</div>;
  }
}

export default InvestorForm;
