import { property } from "lit/decorators.js";
import { HexElement } from "./base.js";

type NativeControl = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

export abstract class HexFormElement extends HexElement {
  static readonly formAssociated = true;

  static override shadowRootOptions = {
    ...HexElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property({ type: String }) name = "";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) required = false;

  protected readonly internals: ElementInternals;

  constructor() {
    super();
    this.internals = this.attachInternals();
  }

  protected abstract control(): NativeControl | null;

  protected abstract formValue(): string | File | FormData | null;

  protected abstract resetValue(): void;

  get form(): HTMLFormElement | null {
    return this.internals.form;
  }

  get labels(): NodeList {
    return this.internals.labels;
  }

  get validity(): ValidityState {
    return this.internals.validity;
  }

  get validationMessage(): string {
    return this.internals.validationMessage;
  }

  checkValidity(): boolean {
    return this.internals.checkValidity();
  }

  reportValidity(): boolean {
    return this.internals.reportValidity();
  }

  setCustomValidity(message: string): void {
    this.syncValidity(message || undefined);
  }

  formResetCallback(): void {
    this.resetValue();
    this.commit();
  }

  formDisabledCallback(disabled: boolean): void {
    this.disabled = disabled;
  }

  protected commit(custom?: string): void {
    this.internals.setFormValue(this.formValue());
    this.syncValidity(custom);
  }

  protected syncValidity(custom?: string): void {
    const control = this.control();
    if (!control) return;
    if (custom) {
      this.internals.setValidity({ customError: true }, custom, control);
      return;
    }
    if (control.validity.valid) {
      this.internals.setValidity({});
      return;
    }
    this.internals.setValidity(control.validity, control.validationMessage, control);
  }
}
