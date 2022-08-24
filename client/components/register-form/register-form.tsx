import { useState, MouseEvent } from "react";
import { register } from "../../services/auth.services";

const RegisterForm = () => {

    const [data, setData] = useState({ name: '', email: '', password: '' });

    const handleSubmit = (e: MouseEvent) => {

        e.preventDefault();

        console.log('Submit', data);

        try {

            register({ name: data.name, email: data.email, password: data.password }).then(data => {
                console.log(data)
            }).catch(err => console.log(err));

        } catch (err) {
            console.log(err);
        }
    }

    return (
        <section className="py-5">
            <div className="container mx-auto px-10">
                <form>
                    <input
                        type="text"
                        placeholder="Enter your name"
                        name="name"
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        className="block w-1/4 mx-auto p-2 border border-slate-200 outline-none my-5"
                    />
                    <input
                        type="email"
                        placeholder="Enter your email"
                        name="email"
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        className="block w-1/4 mx-auto p-2 border border-slate-200 outline-none my-5"
                    />
                    <input
                        type="password"
                        placeholder="Enter your password"
                        name="password"
                        value={data.password}
                        onChange={(e) => setData({ ...data, password: e.target.value })}
                        className="block w-1/4 mx-auto p-2 border border-slate-200 outline-none my-5"
                    />
                    <button onClick={handleSubmit} className="block w-1/4 mx-auto p-2 bg-blue-500 text-white rounded-md">Register</button>
                </form>
            </div>
        </section>
    )
}

export default RegisterForm;