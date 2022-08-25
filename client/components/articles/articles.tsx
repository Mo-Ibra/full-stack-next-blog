import Article from "./article/article";

const Articles = () => {
    return (
        <section className="py-5">
            <div className="container mx-auto px-10">
                <div className="grid grid-cols-3">
                    <Article />
                    <Article />
                    <Article />
                </div>
            </div>
        </section>
    )
}

export default Articles;