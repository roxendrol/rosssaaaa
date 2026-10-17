// Gera lib/seed.json (catálogo inicial) a partir da tabela abaixo.
const fs = require('fs');
const cats = [
  { id: 'gloss', name: 'Gloss e Lábios', emoji: '💋' },
  { id: 'maquiagem', name: 'Maquiagem', emoji: '💄' },
  { id: 'skincare', name: 'Skincare', emoji: '🧴' },
  { id: 'corpo', name: 'Corpo e Autocuidado', emoji: '🛁' },
  { id: 'perfumaria', name: 'Perfumaria', emoji: '🌸' },
  { id: 'kits', name: 'Kits', emoji: '🎁' },
  { id: 'acessorios', name: 'Acessórios', emoji: '🎀' },
];
const desc = {
  gloss: 'Brilho irresistível, toque macio e muito charme. Modelos e cores sujeitos à disponibilidade — consulte no WhatsApp! 💖',
  maquiagem: 'Cor, cobertura e acabamento lindo para o seu look. Consulte tons disponíveis no WhatsApp! 💄',
  skincare: 'Cuidado delicado para a sua pele e seus lábios, todos os dias. Consulte disponibilidade no WhatsApp! 🧴',
  corpo: 'Autocuidado do jeitinho que você merece: hidratação, perfume e momentos de spa em casa. 🛁',
  kits: 'Presente cheio de mimos, montado com muito carinho para surpreender. Consulte itens e personalização no WhatsApp! 🎀',
};
// [foto, categoria, título, preço em centavos]
const rows = [
  [1,'kits','Cesta Presente Laço Pink',14990],[2,'kits','Kit Necessaire Pink com Chaveiro',11990],
  [3,'kits','Box Presente Glam',12990],[4,'kits','Cesta Presente Rosa Xadrez',13990],
  [5,'kits','Box Gloss e Pompom',12990],[6,'kits','Box Cuidados e Perfume',13990],
  [7,'corpo','Kit Spa Dourado Esfoliante',12990],[8,'kits','Box Coração Rosa',13990],
  [9,'kits','Cesta Xadrez Laço Pink',14990],[10,'kits','Buquê de Presente Fofinho',15990],
  [11,'kits','Kit Necessaire Love',11990],[12,'gloss','Gloss Chaveiro Coração',2490],
  [13,'gloss','Duo Gloss Chaveiro Charm',4490],[14,'gloss','Quarteto de Glosses Cintilantes',5990],
  [15,'gloss','Gloss Coelhinho Pompom',2990],[16,'maquiagem','Trio de Batons Ursinho',4990],
  [17,'skincare','Hidratante Labial Morango',1990],[18,'gloss','Kit Gloss Hexagonal Mimo',3990],
  [19,'gloss','Gloss Glitter com Pompom',2490],[20,'maquiagem','Batom Líquido Matte Love',2490],
  [21,'gloss','Gloss Pompom Coelhinho',2790],[22,'gloss','Gloss Pompom Laço Pink',2790],
  [23,'gloss','Gloss Bolinha Glitter',2290],[24,'gloss','Gloss Bolinha Estrelinha',2290],
  [25,'gloss','Gloss Chaveiro Miçangas',2690],[26,'gloss','Gloss Pompom Fofinho',2790],
  [27,'gloss','Gloss Chaveiro Boneca Azul',2990],[28,'gloss','Gloss Chaveiro Boneca Lilás',2990],
  [29,'gloss','Gloss Chaveiro Boneca Rosa',2990],[30,'gloss','Gloss Chaveiro Boneca Pirulito',2990],
  [31,'gloss','Gloss Pompom Rosa Fofo',2790],[32,'gloss','Gloss Chaveiro Scrunchie',3190],
  [33,'gloss','Gloss Glitter Pérolas',2890],[34,'gloss','Gloss Chaveiro Boneca Doce',2990],
  [35,'gloss','Gloss Chaveiro Boneca Vermelha',2990],[36,'gloss','Gloss Chaveiro Boneca Azulzinho',2990],
  [37,'gloss','Gloss Chaveiro Boneca Laçinho',2990],[38,'gloss','Gloss Chaveiro Boneca Sonho',2990],
  [39,'gloss','Lip Oil Pompom',2690],[40,'gloss','Gloss Chaveiro Boneca Rosinha',2990],
  [41,'gloss','Kit Coração Gloss e Lápis',4990],[42,'maquiagem','Lip Tint Divertido (Kit 3)',4290],
  [43,'gloss','Trio Lip Tint',5490],[44,'gloss','Glosses Florzinha',3490],
  [45,'gloss','Gloss Glitter Orelhinhas',2890],[46,'gloss','Gloss Chaveiro Bolsinha',2990],
  [47,'gloss','Kit Lábios Brilho Duplo',3990],[48,'gloss','Mini Bolsinha Gloss',3490],
  [49,'kits','Kit Bolsinha Fofa e Glosses',12990],[50,'kits','Kit Necessaire Transparente',10990],
  [51,'kits','Kit Necessaire Love Sweet',11990],[52,'kits','Kit Necessaire Pink Charm',11990],
  [53,'kits','Kit Necessaire Lilás Fofa',11990],[54,'kits','Kit Necessaire Pink Laço',11990],
  [55,'kits','Kit Necessaire Lilás Brilho',11990],[56,'kits','Buquê Beauty Rosa',15990],
  [57,'kits','Buquê Beauty Pincéis',16990],[58,'kits','Buquê Beauty Pincéis Lilás',16990],
  [59,'kits','Buquê Beauty Pincéis Rosé',16990],[60,'kits','Kit Necessaire Lilás Love',11990],
  [61,'kits','Box Surpresa Pink',13990],[62,'kits','Box Gloss Hexagonal',12990],
  [63,'kits','Box Presente Brilho',12990],[64,'kits','Box Doce Pink',11990],
  [65,'kits','Box Tesouro Pink',13990],[66,'kits','Box Mimos Pink',12990],
  [67,'kits','Box Coração Roxo',13990],[68,'kits','Box Autocuidado Rosa',12990],
  [69,'kits','Box Gloss Premium',13990],[70,'kits','Box Lilás Encantado',13990],
  [71,'kits','Box Lilás Mimo',12990],[72,'kits','Cestas Presente Duo',15990],
  [73,'corpo','Kit Body Cream e Body Splash',11990],[74,'corpo','Kit Spa Dourado Esfoliante e Óleo',13990],
  [75,'corpo','Kit Spa Rosé Hidratante',12990],[76,'kits','Cesta Presente Ursinho',13990],
  [77,'kits','Cesta Presente Laço Rosa',14990],[78,'kits','Cesta Presente Premium',15990],
  [79,'kits','Cesta Presente Pink Glam',14990],[80,'kits','Cesta Presente Xadrez Rosa',14990],
  [81,'gloss','Display Gloss Cute com Pompom',2490],[82,'kits','Cesta Presente Girl Power',13990],
];
const products = rows.map(([n, cat, title, price]) => ({
  id: 'p' + String(n).padStart(2, '0'), title, price, cat,
  img: `/products/p${String(n).padStart(2, '0')}.jpg`,
  desc: desc[cat] || '', hidden: false,
}));
fs.writeFileSync(__dirname + '/../lib/seed.json', JSON.stringify({ categories: cats, products }, null, 1));
console.log(products.length, 'produtos');
