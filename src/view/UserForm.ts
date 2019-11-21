import { User } from './../model/User';
import { Events } from '../framework/model/Events';

type EventsMap = { [key: string]: () => void };

export class UserForm {
  constructor(private parent: Element, private model: User) {
    this.listenToModelChanges();
  }

  render = (): void => {
    const template: HTMLTemplateElement = document.createElement('template');
    template.innerHTML = this.template();
    this.bindEvents(template.content);
    this.parent.innerHTML = '';
    this.parent.append(template.content);
  };

  private listenToModelChanges = (): void => {
    this.model.on(Events.change, this.render);
  };

  private template = (): string => {
    return `
      <form class="user-form" autocomplete="off">
        <h1>User Form</h1>
        <div class="user-form__row">
          <div>
            <span class="user-form__attr">Name: </span>
            <span class="user-form__value">${this.model.get('name')}</span><br />
            <span class="user-form__attr">Age: </span>
            <span class="user-form__value">${this.model.get('age')}</span>
          </div>
        </div>
        <div class="user-form__row">
          <input name="name" class="user-form__input" placeholder="Name.." />
          <button type="button" data-role="update-name">Update</button>
        </div>
        <div class="user-form__row">
          <button type="button" data-role="random-age">Random Age</button>
        </div>
      </form>
    `;
  };

  private bindEvents = (fragment: DocumentFragment): void => {
    const eventsMap: EventsMap = this.eventsMap();
    for (let key in eventsMap) {
      const [event, selector] = key.split(':');
      fragment.querySelectorAll(selector).forEach((element: Element) => {
        element.addEventListener(event, eventsMap[key]);
      });
    }
  };

  private eventsMap = (): EventsMap => {
    return {
      'click:button[data-role="update-name"]': this.onSaveButtonClick,
      'click:button[data-role="random-age"]': this.onSetRandomAgeButtonClick,
    };
  };

  private onSaveButtonClick = (): void => {
    const input: Element = this.parent.querySelector('input[name="name"]');
    const name: string = (input as HTMLInputElement).value;
    if (name && name.trim().length > 0) {
      this.model.set({ name: name.trim() });
    }
  };

  private onSetRandomAgeButtonClick = (): void => {
    this.model.setRandomAge();
  };
}
