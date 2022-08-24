const Navbar = () => {
    return (
        <nav className="py-4 bg-white shadow-sm border-b border-slate-200">
            <div className="container mx-auto px-10">
                <div className="flex justify-between items-center">
                    <div>
                        <h2>Next BLOG</h2>
                    </div>
                    <div>
                        {/* Check if Auth */}
                        <button className="bg-blue-500 text-white py-1 px-4 text-sm rounded-sm">Login</button>
                        {/* <button className="text-red-500 border border-red-500 mx-2 py-1 px-4 text-sm rounded-sm hover:bg-red-500 hover:text-white duration-300">Logout</button> */}
                    </div>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;