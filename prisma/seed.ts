import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const APPROVED = "APPROVED" as const;

async function main() {
  // Test user
  const testUser = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      email: "test@example.com",
      name: "Test User",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=test",
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "foodie@example.com" },
    update: {},
    create: {
      email: "foodie@example.com",
      name: "Foodie Fan",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=foodie",
    },
  });

  // ── Brand: Chobani ─────────────────────────────────────────────────────────
  const chobani = await prisma.brand.upsert({
    where: { slug: "chobani" },
    update: {},
    create: {
      name: "Chobani", status: "APPROVED",
      slug: "chobani",
      description:
        "Chobani is a food company known for making high-quality, nutritious natural food. Best known for Greek yogurt.",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Chobani_logo.svg/320px-Chobani_logo.svg.png",
    },
  });

  const chobaniGreek = await prisma.productLine.upsert({
    where: { slug: "chobani-greek-yogurt" },
    update: {},
    create: {
      brandId: chobani.id,
      name: "Greek Yogurt",
      slug: "chobani-greek-yogurt",
      status: APPROVED,
      description: "Thick, creamy Greek yogurt made with only natural ingredients.",
      imageUrl: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400",
    },
  });

  const chobaniOat = await prisma.productLine.upsert({
    where: { slug: "chobani-oat" },
    update: {},
    create: {
      brandId: chobani.id,
      name: "Oat Drink",
      slug: "chobani-oat",
      status: APPROVED,
      description: "Plant-based oat milk beverage with a creamy, smooth taste.",
      imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400",
    },
  });

  const chobaniBlueberry = await prisma.variation.upsert({
    where: { slug: "chobani-greek-yogurt-blueberry" },
    update: {},
    create: {
      productLineId: chobaniGreek.id,
      name: "Blueberry",
      slug: "chobani-greek-yogurt-blueberry",
      status: APPROVED,
      description: "Greek yogurt with sweet blueberry fruit on the bottom.",
      tags: ["yogurt", "fruit", "high-protein", "gluten-free"],
    },
  });

  const chobaniVanilla = await prisma.variation.upsert({
    where: { slug: "chobani-greek-yogurt-vanilla" },
    update: {},
    create: {
      productLineId: chobaniGreek.id,
      name: "Vanilla",
      slug: "chobani-greek-yogurt-vanilla",
      status: APPROVED,
      description: "Smooth Greek yogurt with natural vanilla flavor.",
      tags: ["yogurt", "vanilla", "high-protein", "gluten-free"],
    },
  });

  const chobaniOatOriginal = await prisma.variation.upsert({
    where: { slug: "chobani-oat-original" },
    update: {},
    create: {
      productLineId: chobaniOat.id,
      name: "Original",
      slug: "chobani-oat-original",
      status: APPROVED,
      description: "Plain oat milk, great for coffee or cereal.",
      tags: ["oat-milk", "plant-based", "dairy-free", "vegan"],
    },
  });

  const chobaniOatVanilla = await prisma.variation.upsert({
    where: { slug: "chobani-oat-vanilla" },
    update: {},
    create: {
      productLineId: chobaniOat.id,
      name: "Vanilla",
      slug: "chobani-oat-vanilla",
      status: APPROVED,
      description: "Oat milk with a hint of vanilla, perfect for smoothies.",
      tags: ["oat-milk", "vanilla", "plant-based", "dairy-free"],
    },
  });

  // ── Brand: Kind ────────────────────────────────────────────────────────────
  const kind = await prisma.brand.upsert({
    where: { slug: "kind" },
    update: {},
    create: {
      name: "Kind", status: "APPROVED",
      slug: "kind",
      description:
        "Kind makes wholesome snacks from whole nuts and fruits, with no artificial sweeteners.",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Kind_Snacks_logo.svg/320px-Kind_Snacks_logo.svg.png",
    },
  });

  const kindBars = await prisma.productLine.upsert({
    where: { slug: "kind-bars" },
    update: {},
    create: {
      brandId: kind.id,
      name: "Kind Bars",
      slug: "kind-bars",
      status: APPROVED,
      description: "Nut and fruit bars made with whole ingredients you can see and pronounce.",
      imageUrl: "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400",
    },
  });

  const kindMini = await prisma.productLine.upsert({
    where: { slug: "kind-minis" },
    update: {},
    create: {
      brandId: kind.id,
      name: "Kind Minis",
      slug: "kind-minis",
      status: APPROVED,
      description: "Bite-sized versions of your favorite Kind bars.",
      imageUrl: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400",
    },
  });

  const kindAlmondCoconut = await prisma.variation.upsert({
    where: { slug: "kind-bars-almond-coconut" },
    update: {},
    create: {
      productLineId: kindBars.id,
      name: "Almond & Coconut",
      slug: "kind-bars-almond-coconut",
      status: APPROVED,
      description: "Crunchy almonds and toasted coconut in every bite.",
      tags: ["nuts", "coconut", "gluten-free", "non-gmo"],
    },
  });

  const kindDarkChocolate = await prisma.variation.upsert({
    where: { slug: "kind-bars-dark-chocolate-nuts" },
    update: {},
    create: {
      productLineId: kindBars.id,
      name: "Dark Chocolate Nuts & Sea Salt",
      slug: "kind-bars-dark-chocolate-nuts",
      status: APPROVED,
      description: "Dark chocolate drizzled over whole nuts with a touch of sea salt.",
      tags: ["chocolate", "nuts", "sea-salt", "gluten-free"],
    },
  });

  const kindMiniPeanut = await prisma.variation.upsert({
    where: { slug: "kind-minis-peanut-butter" },
    update: {},
    create: {
      productLineId: kindMini.id,
      name: "Peanut Butter Dark Chocolate",
      slug: "kind-minis-peanut-butter",
      status: APPROVED,
      description: "Mini bars with peanut butter and dark chocolate.",
      tags: ["peanut-butter", "chocolate", "mini", "gluten-free"],
    },
  });

  const kindMiniCaramel = await prisma.variation.upsert({
    where: { slug: "kind-minis-caramel-almond" },
    update: {},
    create: {
      productLineId: kindMini.id,
      name: "Caramel Almond & Sea Salt",
      slug: "kind-minis-caramel-almond",
      status: APPROVED,
      description: "Mini bars with caramel, almonds, and a pinch of sea salt.",
      tags: ["caramel", "almond", "sea-salt", "mini"],
    },
  });

  // ── Brand: Clif Bar ────────────────────────────────────────────────────────
  const clifBar = await prisma.brand.upsert({
    where: { slug: "clif-bar" },
    update: {},
    create: {
      name: "Clif Bar", status: "APPROVED",
      slug: "clif-bar",
      description:
        "Clif Bar & Company makes energy bars and other foods for people on the go.",
      logoUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Clif_Bar_%26_Company_logo.svg/320px-Clif_Bar_%26_Company_logo.svg.png",
    },
  });

  const clifEnergy = await prisma.productLine.upsert({
    where: { slug: "clif-energy-bar" },
    update: {},
    create: {
      brandId: clifBar.id,
      name: "Energy Bar",
      slug: "clif-energy-bar",
      status: APPROVED,
      description: "The original energy bar for sustained energy during activity.",
      imageUrl: "https://images.unsplash.com/photo-1622484211148-2e84fe9e8f4e?w=400",
    },
  });

  const clifShot = await prisma.productLine.upsert({
    where: { slug: "clif-shot-bloks" },
    update: {},
    create: {
      brandId: clifBar.id,
      name: "Shot Bloks",
      slug: "clif-shot-bloks",
      status: APPROVED,
      description: "Chewable energy cubes for athletes during endurance activity.",
      imageUrl: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400",
    },
  });

  const clifChocolateChip = await prisma.variation.upsert({
    where: { slug: "clif-energy-bar-chocolate-chip" },
    update: {},
    create: {
      productLineId: clifEnergy.id,
      name: "Chocolate Chip",
      slug: "clif-energy-bar-chocolate-chip",
      status: APPROVED,
      description: "Classic energy bar with chocolate chips.",
      tags: ["energy", "chocolate", "oats", "plant-based"],
    },
  });

  const clifBlueberry = await prisma.variation.upsert({
    where: { slug: "clif-energy-bar-blueberry-crisp" },
    update: {},
    create: {
      productLineId: clifEnergy.id,
      name: "Blueberry Crisp",
      slug: "clif-energy-bar-blueberry-crisp",
      status: APPROVED,
      description: "Energy bar with real blueberries and crispy rice.",
      tags: ["energy", "blueberry", "oats", "plant-based"],
    },
  });

  const clifShotMountain = await prisma.variation.upsert({
    where: { slug: "clif-shot-bloks-mountain-berry" },
    update: {},
    create: {
      productLineId: clifShot.id,
      name: "Mountain Berry",
      slug: "clif-shot-bloks-mountain-berry",
      status: APPROVED,
      description: "Berry-flavored chewable energy bloks with electrolytes.",
      tags: ["energy", "berry", "electrolytes", "endurance"],
    },
  });

  const clifShotCitrus = await prisma.variation.upsert({
    where: { slug: "clif-shot-bloks-citrus" },
    update: {},
    create: {
      productLineId: clifShot.id,
      name: "Citrus",
      slug: "clif-shot-bloks-citrus",
      status: APPROVED,
      description: "Citrus-flavored energy bloks with sodium and potassium.",
      tags: ["energy", "citrus", "electrolytes", "endurance"],
    },
  });

  // ── Brand: Nissin ──────────────────────────────────────────────────────────
  const nissin = await prisma.brand.upsert({
    where: { slug: "nissin" },
    update: {},
    create: {
      name: "Nissin",
      slug: "nissin",
      status: APPROVED,
      description:
        "Nissin Foods invented instant noodles in 1958. Their Cup Noodles and Top Ramen lines are among the best-known instant noodles in the world.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Nissin_Foods_logo.svg/320px-Nissin_Foods_logo.svg.png",
    },
  });

  const cupNoodles = await prisma.productLine.upsert({
    where: { slug: "nissin-cup-noodles" },
    update: {},
    create: {
      brandId: nissin.id,
      name: "Cup Noodles",
      slug: "nissin-cup-noodles",
      status: APPROVED,
      description: "The original instant noodle cup — just add boiling water.",
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    },
  });

  const topRamen = await prisma.productLine.upsert({
    where: { slug: "nissin-top-ramen" },
    update: {},
    create: {
      brandId: nissin.id,
      name: "Top Ramen",
      slug: "nissin-top-ramen",
      status: APPROVED,
      description: "Classic brick-style instant ramen with a rich broth packet.",
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    },
  });

  const cupNoodlesChicken = await prisma.variation.upsert({
    where: { slug: "nissin-cup-noodles-chicken" },
    update: {},
    create: {
      productLineId: cupNoodles.id,
      name: "Chicken",
      slug: "nissin-cup-noodles-chicken",
      status: APPROVED,
      description: "Classic chicken-flavored broth with thin noodles and dried vegetables.",
      tags: ["chicken", "instant", "cup", "savory"],
    },
  });

  const cupNoodlesBeef = await prisma.variation.upsert({
    where: { slug: "nissin-cup-noodles-beef" },
    update: {},
    create: {
      productLineId: cupNoodles.id,
      name: "Beef",
      slug: "nissin-cup-noodles-beef",
      status: APPROVED,
      description: "Hearty beef-flavored broth with noodles and dried veggie bits.",
      tags: ["beef", "instant", "cup", "savory"],
    },
  });

  const cupNoodlesSpicyChicken = await prisma.variation.upsert({
    where: { slug: "nissin-cup-noodles-spicy-chicken" },
    update: {},
    create: {
      productLineId: cupNoodles.id,
      name: "Spicy Chicken",
      slug: "nissin-cup-noodles-spicy-chicken",
      status: APPROVED,
      description: "Chicken broth with a spicy kick. Extra heat, same familiar noodles.",
      tags: ["chicken", "spicy", "instant", "cup"],
    },
  });

  const topRamenChicken = await prisma.variation.upsert({
    where: { slug: "nissin-top-ramen-chicken" },
    update: {},
    create: {
      productLineId: topRamen.id,
      name: "Chicken",
      slug: "nissin-top-ramen-chicken",
      status: APPROVED,
      description: "Wavy brick noodles with a classic chicken seasoning packet.",
      tags: ["chicken", "instant", "brick", "budget"],
    },
  });

  const topRamenSoy = await prisma.variation.upsert({
    where: { slug: "nissin-top-ramen-soy-sauce" },
    update: {},
    create: {
      productLineId: topRamen.id,
      name: "Soy Sauce",
      slug: "nissin-top-ramen-soy-sauce",
      status: APPROVED,
      description: "Umami-forward soy sauce broth — cleaner and less salty than the chicken.",
      tags: ["soy", "umami", "instant", "brick"],
    },
  });

  // ── Brand: Maruchan ────────────────────────────────────────────────────────
  const maruchan = await prisma.brand.upsert({
    where: { slug: "maruchan" },
    update: {},
    create: {
      name: "Maruchan",
      slug: "maruchan",
      status: APPROVED,
      description:
        "Maruchan is an American brand of instant ramen noodles, known for its wide flavor variety and affordable price point.",
    },
  });

  const maruchanRamen = await prisma.productLine.upsert({
    where: { slug: "maruchan-ramen-noodle-soup" },
    update: {},
    create: {
      brandId: maruchan.id,
      name: "Ramen Noodle Soup",
      slug: "maruchan-ramen-noodle-soup",
      status: APPROVED,
      description: "Brick-style instant ramen in a huge range of flavors.",
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    },
  });

  const maruchanInstantLunch = await prisma.productLine.upsert({
    where: { slug: "maruchan-instant-lunch" },
    update: {},
    create: {
      brandId: maruchan.id,
      name: "Instant Lunch",
      slug: "maruchan-instant-lunch",
      status: APPROVED,
      description: "Cup-style instant ramen — same great flavors, no pot needed.",
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    },
  });

  const maruchanChicken = await prisma.variation.upsert({
    where: { slug: "maruchan-ramen-chicken" },
    update: {},
    create: {
      productLineId: maruchanRamen.id,
      name: "Chicken",
      slug: "maruchan-ramen-chicken",
      status: APPROVED,
      description: "Light chicken broth with thin, springy noodles.",
      tags: ["chicken", "instant", "brick", "budget"],
    },
  });

  const maruchanLimeChicken = await prisma.variation.upsert({
    where: { slug: "maruchan-ramen-lime-chicken" },
    update: {},
    create: {
      productLineId: maruchanRamen.id,
      name: "Lime Chicken",
      slug: "maruchan-ramen-lime-chicken",
      status: APPROVED,
      description: "Chicken broth with a citrusy lime twist — surprisingly refreshing.",
      tags: ["chicken", "lime", "instant", "brick"],
    },
  });

  const maruchanSpicyChicken = await prisma.variation.upsert({
    where: { slug: "maruchan-ramen-spicy-chicken" },
    update: {},
    create: {
      productLineId: maruchanRamen.id,
      name: "Spicy Chicken",
      slug: "maruchan-ramen-spicy-chicken",
      status: APPROVED,
      description: "Fiery chicken broth for those who want more heat.",
      tags: ["chicken", "spicy", "instant", "brick"],
    },
  });

  const maruchanCupBeef = await prisma.variation.upsert({
    where: { slug: "maruchan-instant-lunch-beef" },
    update: {},
    create: {
      productLineId: maruchanInstantLunch.id,
      name: "Beef",
      slug: "maruchan-instant-lunch-beef",
      status: APPROVED,
      description: "Rich beef-flavored broth in a convenient cup.",
      tags: ["beef", "instant", "cup", "budget"],
    },
  });

  // ── Brand: Nongshim ────────────────────────────────────────────────────────
  const nongshim = await prisma.brand.upsert({
    where: { slug: "nongshim" },
    update: {},
    create: {
      name: "Nongshim",
      slug: "nongshim",
      status: APPROVED,
      description:
        "Nongshim is a South Korean food company famous for its bold, spicy ramen — most notably Shin Ramyun, one of the best-selling instant noodles in the world.",
      logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Nongshim_Logo_(english).svg/320px-Nongshim_Logo_(english).svg.png",
    },
  });

  const shinRamyun = await prisma.productLine.upsert({
    where: { slug: "nongshim-shin-ramyun" },
    update: {},
    create: {
      brandId: nongshim.id,
      name: "Shin Ramyun",
      slug: "nongshim-shin-ramyun",
      status: APPROVED,
      description: "Korea's #1 ramen — thick noodles in a rich, spicy beef broth.",
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    },
  });

  const ansungTangmyun = await prisma.productLine.upsert({
    where: { slug: "nongshim-ansung-tangmyun" },
    update: {},
    create: {
      brandId: nongshim.id,
      name: "Ansungtangmyun",
      slug: "nongshim-ansung-tangmyun",
      status: APPROVED,
      description: "A milder, savory Korean ramen with a fermented soybean paste base.",
      imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400",
    },
  });

  const shinOriginal = await prisma.variation.upsert({
    where: { slug: "nongshim-shin-ramyun-original" },
    update: {},
    create: {
      productLineId: shinRamyun.id,
      name: "Original",
      slug: "nongshim-shin-ramyun-original",
      status: APPROVED,
      description: "The classic — chewy noodles in a spicy, mushroom-enriched beef broth.",
      tags: ["spicy", "beef", "korean", "thick-noodles"],
    },
  });

  const shinBlack = await prisma.variation.upsert({
    where: { slug: "nongshim-shin-ramyun-black" },
    update: {},
    create: {
      productLineId: shinRamyun.id,
      name: "Black",
      slug: "nongshim-shin-ramyun-black",
      status: APPROVED,
      description: "Premium version with bone broth and a richer, deeper spice profile.",
      tags: ["spicy", "beef", "korean", "premium", "bone-broth"],
    },
  });

  const shinCup = await prisma.variation.upsert({
    where: { slug: "nongshim-shin-ramyun-cup" },
    update: {},
    create: {
      productLineId: shinRamyun.id,
      name: "Cup",
      slug: "nongshim-shin-ramyun-cup",
      status: APPROVED,
      description: "Same bold Shin flavor in a convenient single-serve cup.",
      tags: ["spicy", "beef", "korean", "cup"],
    },
  });

  const ansungOriginal = await prisma.variation.upsert({
    where: { slug: "nongshim-ansung-tangmyun-original" },
    update: {},
    create: {
      productLineId: ansungTangmyun.id,
      name: "Original",
      slug: "nongshim-ansung-tangmyun-original",
      status: APPROVED,
      description: "Earthy, savory doenjang (soybean paste) broth — a Korean comfort classic.",
      tags: ["savory", "korean", "mild", "doenjang"],
    },
  });

  // ── Sample reviews ─────────────────────────────────────────────────────────

  const reviewSeeds = [
    {
      userId: testUser.id,
      variationId: chobaniBlueberry.id,
      rating: 5,
      title: "My daily breakfast staple",
      body: "I eat this every morning. The blueberry flavor is natural and not overly sweet. High protein keeps me full until lunch.",
      wouldBuyAgain: true,
    },
    {
      userId: user2.id,
      variationId: chobaniBlueberry.id,
      rating: 4,
      title: "Great taste, slightly watery",
      body: "Delicious blueberry flavor but the texture can be a little runny compared to other brands. Still a solid choice.",
      wouldBuyAgain: true,
    },
    {
      userId: testUser.id,
      variationId: kindDarkChocolate.id,
      rating: 5,
      title: "Perfect sweet and salty combo",
      body: "The balance of dark chocolate, nuts, and sea salt is incredible. Great snack that doesn't feel like junk food.",
      wouldBuyAgain: true,
    },
    {
      userId: user2.id,
      variationId: kindDarkChocolate.id,
      rating: 4,
      title: "Addictively good",
      body: "Hard to stop at just one bar. A bit pricey but worth it for the quality ingredients.",
      wouldBuyAgain: true,
    },
    {
      userId: testUser.id,
      variationId: clifChocolateChip.id,
      rating: 4,
      title: "Solid pre-workout snack",
      body: "Good energy boost before a run. The chocolate chips add enough sweetness without being overwhelming. A classic for a reason.",
      wouldBuyAgain: true,
    },
    {
      userId: user2.id,
      variationId: clifChocolateChip.id,
      rating: 3,
      title: "Dense but functional",
      body: "Does the job for sustained energy during hikes. A bit dense and can feel heavy if you eat it without activity.",
      wouldBuyAgain: true,
    },
    {
      userId: testUser.id,
      variationId: chobaniOatOriginal.id,
      rating: 4,
      title: "Best oat milk for coffee",
      body: "Froths beautifully and doesn't overpower the coffee flavor. Slightly sweet on its own but perfect in a latte.",
      wouldBuyAgain: true,
    },
    {
      userId: user2.id,
      variationId: kindAlmondCoconut.id,
      rating: 5,
      title: "Light and satisfying",
      body: "The coconut and almond pairing is excellent. Lighter than other Kind bars but still fills you up.",
      wouldBuyAgain: true,
    },
    // Instant noodle reviews
    {
      userId: testUser.id,
      variationId: shinOriginal.id,
      rating: 5,
      title: "The gold standard of instant ramen",
      body: "I've tried hundreds of instant noodles and Shin Ramyun Original is still the benchmark. The broth is deeply spicy and savory, the noodles are thick and chewy. A true classic.",
      wouldBuyAgain: true,
    },
    {
      userId: user2.id,
      variationId: shinOriginal.id,
      rating: 5,
      title: "Addictive heat",
      body: "The spice level is perfect — enough to make you sweat but not so much that you can't taste anything. I add an egg and some scallions and it's better than most restaurant ramen.",
      wouldBuyAgain: true,
    },
    {
      userId: testUser.id,
      variationId: shinBlack.id,
      rating: 4,
      title: "Richer but pricier",
      body: "The bone broth base gives it a noticeably deeper flavor. Worth it as a treat but too expensive for everyday eating. The original is still the better value.",
      wouldBuyAgain: true,
    },
    {
      userId: user2.id,
      variationId: shinBlack.id,
      rating: 5,
      title: "Premium and it shows",
      body: "The Black edition is a real upgrade. Thicker broth, more complex flavor, and the noodles feel slightly better quality. Worth every cent.",
      wouldBuyAgain: true,
    },
    {
      userId: testUser.id,
      variationId: cupNoodlesChicken.id,
      rating: 3,
      title: "Nostalgic but not much else",
      body: "This is pure nostalgia in a cup. The broth is salty and thin, but something about it just hits right at 2am. Don't expect gourmet — just enjoy it for what it is.",
      wouldBuyAgain: true,
    },
    {
      userId: user2.id,
      variationId: cupNoodlesChicken.id,
      rating: 2,
      title: "Way too salty",
      body: "I used to love these but coming back to them as an adult — the sodium is overwhelming. The noodles also get mushy fast. Shin Ramyun has completely replaced this for me.",
      wouldBuyAgain: false,
    },
    {
      userId: testUser.id,
      variationId: cupNoodlesSpicyChicken.id,
      rating: 4,
      title: "Better than the original chicken",
      body: "The spicy version actually has more depth of flavor than the classic. The heat masks the artificial notes. Good desk lunch.",
      wouldBuyAgain: true,
    },
    {
      userId: user2.id,
      variationId: topRamenChicken.id,
      rating: 3,
      title: "Cheap and cheerful",
      body: "10 for a dollar and it tastes like it. But honestly for budget meal prep it's hard to argue with. I dress it up with butter, garlic powder, and a soft-boiled egg.",
      wouldBuyAgain: true,
    },
    {
      userId: testUser.id,
      variationId: topRamenSoy.id,
      rating: 4,
      title: "Underrated flavor",
      body: "Everyone sleeps on the soy sauce flavor. It's cleaner and more umami than the chicken. Less overwhelming saltiness too. This is my go-to for a quick base to build on.",
      wouldBuyAgain: true,
    },
    {
      userId: user2.id,
      variationId: maruchanChicken.id,
      rating: 3,
      title: "Maruchan vs Top Ramen — close call",
      body: "Slightly softer noodles than Top Ramen and a touch more seasoning in the broth. They're nearly identical but I give Maruchan a slight edge for the chicken flavor.",
      wouldBuyAgain: true,
    },
    {
      userId: testUser.id,
      variationId: maruchanLimeChicken.id,
      rating: 4,
      title: "Surprisingly good",
      body: "I bought this by accident and expected to hate it. The lime is subtle and actually brightens the broth. Really refreshing compared to the standard chicken. Will buy again.",
      wouldBuyAgain: true,
    },
    {
      userId: user2.id,
      variationId: maruchanSpicyChicken.id,
      rating: 4,
      title: "Good heat, good price",
      body: "Not as complex as Shin Ramyun but at 25 cents a pack it's excellent value. The spice is real and lingers. Great for lazy spicy noodle nights.",
      wouldBuyAgain: true,
    },
    {
      userId: testUser.id,
      variationId: ansungOriginal.id,
      rating: 5,
      title: "Korean comfort in a bowl",
      body: "Ansungtangmyun is criminally underrated outside Korea. The doenjang base gives it an earthy, fermented depth you won't find in any other instant noodle. This is what I eat when I'm homesick.",
      wouldBuyAgain: true,
    },
    {
      userId: user2.id,
      variationId: shinCup.id,
      rating: 4,
      title: "Shin on the go",
      body: "Convenient but the cup version loses a little of the magic — the noodles don't hold up quite as well and the broth is slightly thinner. Still miles ahead of Cup Noodles.",
      wouldBuyAgain: true,
    },
  ];

  for (const reviewData of reviewSeeds) {
    await prisma.review.upsert({
      where: {
        userId_variationId: {
          userId: reviewData.userId,
          variationId: reviewData.variationId,
        },
      },
      update: {},
      create: reviewData,
    });
  }

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
