const initialRecipes = [
  {
    id: "sufle",
    title: "Akışkan Çikolatalı Sufle",
    description: "İçi sıcak ve akışkan čikolata dolgulu, dışı hafif kabuk bağlamış enfes bir Fransız tatlısı.",
    category: "Tatlı",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    prepTime: 15,
    cookTime: 8,
    servings: 2,
    difficulty: "Orta",
    ingredients: [
      "100g bitter çikolata (en az %60 kakaolu)",
      "50g tereyağı",
      "2 adet yumurta",
      "2 yemek kaşığı toz şeker",
      "1.5 yemek kaşığı un",
      "1 çimdik tuz",
      "Kalıpları yağlamak için: 1 tatlı kaşığı tereyağı ve 1 yemek kaşığı kakao"
    ],
    instructions: [
      "Fırını 220 dereceye ayarlayın ve ısınmaya bırakın. Sufle kaplarını oda sıcaklığındaki tereyağı ile iyice yağlayın, ardından içlerine kakao serpiştirip fazlasını silkeleyin.",
      "Bitter çikolata ve tereyağını bir kaba alıp benmari usulü veya mikrodalgada eritin. Eridikten sonra pürüzsüz olana kadar yaklaşık 1 dakika karıştırın ve ılımaya bırakın.",
      "Ayrı bir çırpma kabında yumurtaları ve toz şekeri, mikserin yüksek devrinde krema kıvamına gelene ve rengi açılana kadar yaklaşık 3 dakika boyunca çırpın.",
      "Ilıyan çikolatalı tereyağı karışımını çırptığınız yumurtalara yavaşça ekleyin. Sönmemesi için spatula yardımıyla alttan üste doğru 30 saniye hafifçe karıştırın.",
      "Unu ve bir çimdik tuzu eleyerek karışıma ekleyin. Spatula ile pürüzsüz bir kıvam alana kadar yaklaşık 45 saniye daha katlayarak karıştırın.",
      "Harcı hazırladığınız kaplara üzerlerinde bir parmak boşluk kalacak şekilde paylaştırın.",
      "Önceden ısıtılmış fırında sufleleri tam 8 dakika pişirin. Fırından çıkan sufleleri 2 dakika ilk sıcağının geçmesi için bekletin, ardından pudra şekeri serpip sıcak servis edin."
    ]
  },
  {
    id: "risotto",
    title: "Kremalı Mantarlı Risotto",
    description: "Arborio pirincinin kendi nişastasıyla bağlanan, taze mantarlar ve parmesanla zenginleştirilmiş İtalyan klasiği.",
    category: "Ana Yemek",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&auto=format&fit=crop&q=80",
    prepTime: 10,
    cookTime: 25,
    servings: 3,
    difficulty: "Zor",
    ingredients: [
      "1.5 su bardağı Arborio pirinci",
      "300g kestane veya kültür mantarı (dilimlenmiş)",
      "1 adet kuru soğan (yemeklik doğranmış)",
      "2 diş sarımsak (ince kıyılmış)",
      "4 yemek kaşığı zeytinyağı",
      "2 yemek kaşığı tereyağı",
      "4 su bardağı sıcak sebze veya tavuk suyu",
      "Yarım su bardağı rendelenmiş parmesan peyniri",
      "Tuz, taze çekilmiş karabiber",
      "Taze biberiye veya maydanoz"
    ],
    instructions: [
      "Sebze veya tavuk suyunu küçük bir tencerede kısık ateşte sürekli sıcak tutun.",
      "Geniş bir tavada zeytinyağını ısıtın. Doğranmış mantarları ekleyip yüksek ateşte suyunu salıp çekene kadar yaklaşık 5 dakika soteleyin ve mantarları ayrı bir tabağa alın.",
      "Aynı tavaya 1 yemek kaşığı tereyağı ekleyin. Soğan ve sarımsakları ekleyip yumuşayana kadar yaklaşık 3 dakika soteleyin.",
      "Arborio pirincini tavaya ekleyin. Pirinçlerin kenarları şeffaflaşana kadar yaklaşık 2 dakika sürekli karıştırarak kavurun.",
      "Sıcak tavuk suyundan bir kepçe ekleyin. Pirinçler suyu tamamen çekene kadar yaklaşık 2-3 dakika boyunca sürekli karıştırın.",
      "Pirinçler suyu çektikçe her seferinde birer kepçe sıcak su eklemeye devam edin. Bu işlemi pirinçler yumuşayıp nişastasını salana kadar yaklaşık 18 dakika boyunca tekrarlayın.",
      "Son kepçe suyla birlikte sotelediğiniz mantarları tavaya geri ekleyin ve 1 dakika karıştırarak ısıtın.",
      "Tavayı ocaktan alın. Kalan 1 yemek kaşığı tereyağını ve rendelenmiş parmesanı ekleyip risottoyu krema kıvamına gelene kadar 1 dakika boyunca hızlıca karıştırın. Kapağını kapatıp 2 dakika dinlendirdikten sonra servis yapın."
    ]
  },
  {
    id: "mercimek",
    title: "Lokanta Usulü Süzme Mercimek Çorbası",
    description: "İpeksi dokusu, limonlu ve tereyağlı sosuyla içinizi ısıtacak geleneksel lokanta çorbası.",
    category: "Çorba",
    image: "https://images.unsplash.com/photo-1547592165-e1d17fed6005?w=800&auto=format&fit=crop&q=80",
    prepTime: 10,
    cookTime: 20,
    servings: 4,
    difficulty: "Kolay",
    ingredients: [
      "1 su bardağı kırmızı mercimek",
      "1 adet kuru soğan",
      "1 adet küçük patates",
      "1 adet küçük havuç",
      "1 yemek kaşığı un",
      "3 yemek kaşığı sıvı yağ",
      "1 yemek kaşığı tereyağı",
      "6 su bardağı sıcak su",
      "1 çay kaşığı kimyon",
      "Tuz, karabiber",
      "Sos için: 1 yemek kaşığı tereyağı, 1 tatlı kaşığı kırmızı toz biber"
    ],
    instructions: [
      "Mercimeği nişastası gidene kadar soğuk suyla iyice yıkayın.",
      "Tencereye sıvı yağı alın. Yemeklik doğranmış soğanı ekleyip pembeleşene kadar 3 dakika kavurun.",
      "Unu ekleyin ve kokusu çıkana kadar yaklaşık 1 dakika kısık ateşte kavurmaya devam edin.",
      "Küp doğranmış patates, havuç ve yıkanmış mercimeği tencereye ekleyip 2 dakika birlikte karıştırarak kavurun.",
      "Sıcak suyu ekleyin, kaynamaya başladıktan sonra tencerenin kapağını yarım kapatarak kısık ateşte mercimek ve sebzeler tamamen yumuşayana kadar yaklaşık 15 dakika pişirin.",
      "Çorbayı pürüzsüz bir kıvam alana kadar blenderdan geçirin (yaklaşık 1 dakika). Kimyon, tuz ve karabiberini ekleyip karıştırın.",
      "Küçük bir tavada sos için tereyağını eritin, kırmızı toz biberi ekleyip 10 saniye kızdırın. Çorbayı kaselere paylaştırıp üzerine bu sostan gezdirerek limonla servis edin."
    ]
  }
];
