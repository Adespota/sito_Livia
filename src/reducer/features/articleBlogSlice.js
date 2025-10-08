import { createSlice } from '@reduxjs/toolkit';

// Questo redux mantiene i dati degli articoli che vengono chiamati nel Blog
const articlesBlogSlice = createSlice({
    name: 'articles',
    initialState: {
        articles: [],
        articlesByCategory: [],
        selectedCategory: null,
        category: [],
    },
    reducers: {
        setArticles(state, action) {
            const newValue = action.payload
            // verifica se l'articolo esiste già
            const isExist = state.articles.find((article) => article.id === newValue.id)

            if (!isExist) {
                // solo quando l'articolo non esiste, lo aggiunge allo stato
                state.articles.push(newValue);
            }
        },
        setArticlesByCategory(state, action) {
            state.articlesByCategory = action.payload;
        },
        setLoading(state, action) {
            state.loading = action.payload;
        },
        setSelectedCategory(state, action) {
            state.selectedCategory = action.payload;
        },
        // Quando viene invocata questa azione la categoria scelta viene resettata e quindi l'interfaccia
        // mostrerà nuovamente gli articoli presenti in articles[]
        resetSelectedCategory(state) {   // Aggiunto questo metodo
            state.selectedCategory = null;
        },
        // Questa azione permette di popolare la pagina Blog con tutte le categorie.
        // Questa azione viene usata nell'hook useFetchCategories
        setCategoryPageBlog(state, action) {
            state.category = action.payload;
        },
    },
});

export const {
    setArticles,
    setSelectedCategory,
    setArticlesByCategory,
    setCategoryPageBlog,
    resetSelectedCategory,
    setLoading,
} = articlesBlogSlice.actions;

export const selectArticles = (state) => state.articles.articles;
export const selectArticlesByCategory = (state) => state.articles.articlesByCategory;
export const selectSelectedCategory = (state) => state.articles.selectedCategory;
export const selectCategoryPageBlog = (state) => state.articles.category;
export const selectLoading = (state) => state.articles.loading;


export default articlesBlogSlice.reducer;
