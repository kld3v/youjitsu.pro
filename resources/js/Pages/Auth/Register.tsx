import Dropdown from '@/Components/Dropdown';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SelectDojo from '@/Components/Submission/SelectDojo';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { PageProps } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
  const { props } = usePage<PageProps<{ dojos: any[] }>>();

  const { dojos } = props;

  const { data, setData, post, processing, errors, reset } = useForm({
    name: '',
    email: '',
    role: 'student',
    password: '',
    password_confirmation: '',
    dojo_id: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    console.log(data);

    post(route('register'), {
      onError: (errors) => {
        console.log(errors);
      },
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

  return (
    <GuestLayout>
      <Head title="Register" />

      <form onSubmit={submit}>
        <div>
          <InputLabel htmlFor="name" value="Name" />

          <TextInput
            id="name"
            name="name"
            value={data.name}
            className="mt-1 block w-full"
            autoComplete="name"
            isFocused={true}
            onChange={(e) => setData('name', e.target.value)}
            required
          />

          <InputError message={errors.name} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="email" value="Email" />

          <TextInput
            id="email"
            type="email"
            name="email"
            value={data.email}
            className="mt-1 block w-full"
            autoComplete="username"
            onChange={(e) => setData('email', e.target.value)}
            required
          />

          <InputError message={errors.email} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel htmlFor="password" value="Password" />

          <TextInput
            id="password"
            type="password"
            name="password"
            value={data.password}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData('password', e.target.value)}
            required
          />

          <InputError message={errors.password} className="mt-2" />
        </div>

        <div className="mt-4">
          <InputLabel
            htmlFor="password_confirmation"
            value="Confirm Password"
          />

          <TextInput
            id="password_confirmation"
            type="password"
            name="password_confirmation"
            value={data.password_confirmation}
            className="mt-1 block w-full"
            autoComplete="new-password"
            onChange={(e) => setData('password_confirmation', e.target.value)}
            required
          />

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>
        <div className="mt-4">
          <InputLabel htmlFor="role" value="Select Role " />

          <Dropdown>
            <Dropdown.Trigger>
              <button
                type="button"
                className="mt-2 w-full rounded bg-gray-100 px-4 py-2 text-gray-700 shadow focus:outline-none"
              >
                {data.role}
              </button>
            </Dropdown.Trigger>
            <Dropdown.Content align="left" width="48">
              <div className="py-1">
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-sm text-white hover:bg-gray-600 focus:bg-gray-200 focus:outline-none"
                  onClick={() => setData('role', 'student')}
                >
                  Student
                </button>
                <button
                  type="button"
                  className="block w-full px-4 py-2 text-sm text-white hover:bg-gray-600 focus:bg-gray-200 focus:outline-none"
                  onClick={() => setData('role', 'sensei')}
                >
                  Sensei
                </button>
              </div>
            </Dropdown.Content>
          </Dropdown>
          <SelectDojo dojos={dojos} setData={setData} />

          <InputError message={errors.password_confirmation} className="mt-2" />
        </div>

        <div className="mt-4 flex items-center justify-end">
          <Link
            href={route('login')}
            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
          >
            Already registered?
          </Link>

          <PrimaryButton className="ms-4" disabled={processing}>
            Register
          </PrimaryButton>
        </div>
      </form>
    </GuestLayout>
  );
}
