'use server';

import formValidation from '@utils/formValidation';
import mailConfig from '@utils/mailConfig';
import { JSDOM } from 'jsdom';
import DOMPurify from 'dompurify';

export async function handleSubmit(formData: FormData) {
  const fields = { dir: '', email: '', subject: '', content: '' };

  const handleSanitation = (val: string) => {
    const win = new JSDOM('').window;
    const purify = DOMPurify(win);

    return purify.sanitize(val);
  };

  Object.keys(fields).map(
    (key) =>
      (fields[key as keyof typeof fields] = handleSanitation(
        formData.get(key) as string
      ))
  );

  const { dir, email, subject, content } = fields;
  const { isValidated } = formValidation({ email, subject, content });

  if (!isValidated) {
    return { status: '400' };
  } else {
    const { env } = process;
    const { HOST_SUCCESS_RESPONSE } = env;
    const { transporter, messageSendDetailsObject } = await mailConfig({
      dir,
      email,
      subject,
      content,
    });

    try {
      const { response } =
        (await transporter.sendMail(messageSendDetailsObject)) || {};
console.log('xxx', HOST_SUCCESS_RESPONSE, response)
      if (response.includes(HOST_SUCCESS_RESPONSE as unknown as string)) {
        return { status: '201' };
      }
    } catch (nodeMailerRequestError) {
      console.error(nodeMailerRequestError);
      return { status: '401' };
    }
  }
}
