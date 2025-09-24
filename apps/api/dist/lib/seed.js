import { prisma } from "./client.js";
const categoryNames = ["Nike", "Adidas", "Converse", "Puma", "Fila"];
const productsData = {
    Nike: [
        {
            name: "Nike Air Force 1",
            price: 79990,
            description: "Um ícone do basquete reinventado para as ruas.",
            url: "nike-air-force-1",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757444689/AIR_FORCE_1_2707_ap4wpe.jpg",
            colors: ["Branco", "Preto"],
            sizes: ["38", "39", "40", "41", "42"],
        },
        {
            name: "Nike Dunk Low",
            price: 89990,
            description: "Estilo retrô com conforto moderno.",
            url: "nike-dunk-low",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757444494/NIKE_DUNK_LOW_RETRO_lctzen.jpg",
            colors: ["Preto", "Branco", "Cinza"],
            sizes: ["39", "40", "41"],
        },
        {
            name: "Nike Air Max 90",
            price: 99990,
            description: "Amortecimento visível e design atemporal.",
            url: "nike-air-max-90",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757444703/AIR_MAX_90_f0a7rf.jpg",
            colors: ["Branco", "Infravermelho"],
            sizes: ["40", "41", "42", "43"],
        },
        {
            name: "Nike Zoom Pegasus 40",
            price: 84999,
            description: "O seu cavalo de batalha com asas para a corrida diária.",
            url: "nike-zoom-pegasus-40",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757444714/NIKE_AIR_ZOOM_PEGASUS_40_28GS_29_yr0gf4.jpg",
            colors: ["Azul", "Preto"],
            sizes: ["38", "39", "40", "41"],
        },
        {
            name: "Nike React Infinity Run 4",
            price: 94999,
            description: "Estabilidade e suporte para longas distâncias.",
            url: "nike-react-infinity-run-4",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757444732/5aac3e934212cb6f6e261ae16e4f612b_1683830333_nob3sk.jpg",
            colors: ["Verde", "Branco"],
            sizes: ["41", "42", "43"],
        },
    ],
    Adidas: [
        {
            name: "Adidas Superstar",
            price: 49999,
            description: "O clássico da biqueira de borracha.",
            url: "adidas-superstar",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757444762/1374508-full_product_h5dimj.jpg",
            colors: ["Branco", "Preto"],
            sizes: ["38", "39", "40"],
        },
        {
            name: "Adidas Ultraboost Light",
            price: 119999,
            description: "Retorno de energia incrível com a leveza do Boost.",
            url: "adidas-ultraboost-light",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757444796/1002670-full_product_d3tscp.jpg",
            colors: ["Preto", "Cinza"],
            sizes: ["40", "41", "42"],
        },
        {
            name: "Adidas Stan Smith",
            price: 44999,
            description: "Simplicidade e elegância nas quadras e nas ruas.",
            url: "adidas-stan-smith",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757444813/adidas-stan-smith-freizeit-core-white-if9264-66c4889775534_mzjnwm.webp",
            colors: ["Branco", "Verde"],
            sizes: ["39", "40", "41", "42"],
        },
        {
            name: "Adidas Forum Low",
            price: 59999,
            description: "Estilo dos anos 80 com um toque moderno.",
            url: "adidas-forum-low",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757444845/1258153_bsbznj.jpg",
            colors: ["Branco", "Azul"],
            sizes: ["38", "39", "40", "41"],
        },
        {
            name: "Adidas Gazelle",
            price: 47999,
            description: "Design versátil com cabedal de camurça.",
            url: "adidas-gazelle",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757444871/adidas-gazelle-flash-aqua-lucid-pink_uyncao.jpg",
            colors: ["Vermelho", "Azul", "Preto"],
            sizes: ["40", "41", "42"],
        },
    ],
    Converse: [
        {
            name: "Converse Chuck Taylor All Star",
            price: 29990,
            description: "O tênis mais icônico do mundo.",
            url: "converse-chuck-taylor-all-star",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757444937/CT_AS_OX_BLACK_jgudgp.jpg",
            colors: ["Preto", "Branco", "Vermelho"],
            sizes: ["35", "36", "37", "38", "39", "40"],
        },
        {
            name: "Converse Chuck 70",
            price: 44990,
            description: "Uma versão premium do clássico.",
            url: "converse-chuck-70",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757444906/ALL_STAR_HI_BLACK_obkpiu.jpg",
            colors: ["Creme", "Preto"],
            sizes: ["38", "39", "40", "41"],
        },
        {
            name: "Converse Run Star Hike",
            price: 69990,
            description: "Solado plataforma e design arrojado.",
            url: "converse-run-star-hike",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757446199/RUN_STAR_HIKE_OX_BLACK_2FWHITE_2FG_gukvwq.jpg",
            colors: ["Branco", "Preto"],
            sizes: ["36", "37", "38"],
        },
        {
            name: "Converse One Star",
            price: 34990,
            description: "O ícone do skate dos anos 90.",
            url: "converse-one-star",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757445007/A06655C_sivasdescalzo-Converse-ONE_STAR_PRO_OX-1704383998-1_hcwt1n.jpg",
            colors: ["Amarelo", "Preto"],
            sizes: ["39", "40", "41"],
        },
        {
            name: "Converse Jack Purcell",
            price: 39990,
            description: 'O clássico com o "sorriso" na biqueira.',
            url: "converse-jack-purcell",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757445068/570483C-1_hxmqny.jpg",
            colors: ["Branco"],
            sizes: ["40", "41", "42"],
        },
    ],
    Puma: [
        {
            name: "Puma Suede Classic",
            price: 44999,
            description: "Um clássico da cultura de rua desde 1968.",
            url: "puma-suede-classic",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757445077/Suede-Classic-Sneakers_rlc00m.jpg",
            colors: ["Preto", "Vermelho"],
            sizes: ["39", "40", "41", "42"],
        },
        {
            name: "Puma Cali",
            price: 54999,
            description: "Vibrações da Califórnia com um toque moderno.",
            url: "puma-cali",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757445090/PUMA-Cali-Court-Leather-Women_s-Sneakers_bqncym.jpg",
            colors: ["Branco"],
            sizes: ["35", "36", "37", "38"],
        },
        {
            name: "Puma RS-X",
            price: 69999,
            description: "Design robusto e tecnologia de amortecimento RS.",
            url: "puma-rs-x",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757445099/RS-X-Soft-Women_s-Sneakers_vazxnv.jpg",
            colors: ["Colorido", "Preto"],
            sizes: ["40", "41", "42"],
        },
        {
            name: "Puma Future Rider",
            price: 59999,
            description: "Inspirado na corrida, renascido para as ruas.",
            url: "puma-future-rider",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757445122/main-square_7d4735bf-7bc8-4b7b-84ad-c14c939d4b0e_jz5fgd.jpg",
            colors: ["Azul", "Amarelo"],
            sizes: ["38", "39", "40"],
        },
        {
            name: "Puma Shuffle",
            price: 34999,
            description: "Estilo clássico do tênis para o uso diário.",
            url: "puma-shuffle",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757445132/PUMA-Shuffle-Men_s-Sneakers_rkcpyk.jpg",
            colors: ["Branco", "Preto"],
            sizes: ["39", "40", "41", "42", "43"],
        },
    ],
    Fila: [
        {
            name: "Fila Disruptor II",
            price: 59990,
            description: 'O autêntico "chunky sneaker" que marcou uma era.',
            url: "fila-disruptor-ii",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757445161/jd_721305_a_ajrdfw.jpg",
            colors: ["Branco"],
            sizes: ["35", "36", "37", "38"],
        },
        {
            name: "Fila Racer T2",
            price: 49990,
            description: "Performance e tecnologia para corredores.",
            url: "fila-racer-t2",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757445779/tenis_fila_racer_t2_1144930_branco_vermelho_masculino_3973_2_0752ec17958efb415db25fa14cd1e352_ewya4o.jpg",
            colors: ["Azul Marinho", "Laranja"],
            sizes: ["39", "40", "41", "42"],
        },
        {
            name: "Fila Grant Hill 2",
            price: 79990,
            description: "O retorno de um ícone do basquete dos anos 90.",
            url: "fila-grant-hill-2",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757445283/fila-grant-hill-2-25th-anniversary-white-1_awkeem.jpg",
            colors: ["Branco", "Azul", "Vermelho"],
            sizes: ["40", "41", "42", "43"],
        },
        {
            name: "Fila Renno",
            price: 54990,
            description: "Design retrô running com materiais modernos.",
            url: "fila-renno",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757445334/1026634-0012V1_vpehdk.jpg",
            colors: ["Cinza", "Amarelo"],
            sizes: ["38", "39", "40"],
        },
        {
            name: "Fila Classic Court",
            price: 27990,
            description: "Simplicidade e versatilidade para o dia a dia.",
            url: "fila-classic-court",
            image: "https://res.cloudinary.com/djlxsef4y/image/upload/v1757445508/Fila-T_C3_AAnis-Fila-Classic-Court-Branco-1589-9176547-1-zoom_lnia4i.jpg",
            colors: ["Branco", "Verde"],
            sizes: ["39", "40", "41", "42"],
        },
    ],
};
async function seed() {
    console.log("Iniciando o processo de seeding...");
    console.log("Limpando dados existentes...");
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    console.log("Dados limpos.");
    console.log("Criando categorias e produtos...");
    for (const categoryName of categoryNames) {
        const category = await prisma.category.create({
            data: { name: categoryName },
        });
        console.log(`Categoria '${category.name}' criada com id: ${category.id}`);
        const productsForCategory = productsData[categoryName];
        const productsToCreate = productsForCategory.map((product) => ({
            ...product,
            categoryId: category.id,
        }));
        await prisma.product.createMany({
            data: productsToCreate,
        });
        console.log(`- ${productsToCreate.length} produtos da categoria '${category.name}' criados.`);
    }
    console.log("Seeding concluído com sucesso!");
    prisma.$disconnect();
}
seed();
//# sourceMappingURL=seed.js.map