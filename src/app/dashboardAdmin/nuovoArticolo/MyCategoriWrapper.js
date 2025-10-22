"use client";
import { useSelector, useDispatch } from "react-redux";
import {
    Categoria,
    selectors,
    setSelectedCategory, // named export dal barrel
} from "@adespota/my-react-component";

export default function MyCategoriaWrapper() {
    const dispatch = useDispatch();

    // Tutte le categorie (selector della lib)
    const allCategories = useSelector(selectors.selectCategoryPageBlog);

    // Categoria selezionata: se non hai un selector dedicato, leggila dal slice
    const selectedCategory = useSelector(
        (state) => state.articlesBlog?.selectedCategory
    );

    const handleSelect = (value) => {
        dispatch(setSelectedCategory(value));
    };

    const handleDelete = (id) => {
        // dispatch(deleteCategory(id));
    };

    return (
        <Categoria
            selectedCategory={selectedCategory}
            allCategories={allCategories}
            onCategorySelect={handleSelect}
            handleDelete={handleDelete}
        />
    );
}
