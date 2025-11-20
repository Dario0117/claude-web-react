import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { AppFormField } from '../components/app-form-field';
import { AppSubscribeErrorButton } from '../components/app-form-subscribe-error';
import { AppSubscribeSubmitButton } from '../components/app-form-subscribe-submit';

export const { fieldContext, formContext, useFieldContext, useFormContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    AppFormField,
  },
  formComponents: {
    AppSubscribeSubmitButton,
    AppSubscribeErrorButton,
  },
});
