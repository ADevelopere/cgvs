CREATE TYPE "public"."app_language" AS ENUM('ar', 'en');--> statement-breakpoint
CREATE TYPE "public"."country_code" AS ENUM('SA', 'PS', 'YE', 'SY', 'EG', 'KW', 'QA', 'OM', 'BH', 'LB', 'JO', 'IQ', 'LY', 'AE', 'TN', 'DZ', 'MA', 'SD', 'ID', 'MR', 'SO', 'KM', 'DJ', 'ER', 'SS', 'EH', 'AD', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DK', 'DM', 'DO', 'EC', 'EE', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'IE', 'IM', 'IN', 'IO', 'IR', 'IS', 'IT', 'JE', 'JM', 'JP', 'KE', 'KG', 'KH', 'KI', 'KN', 'KP', 'KR', 'KY', 'KZ', 'LA', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PT', 'PW', 'PY', 'RE', 'RO', 'RS', 'RU', 'RW', 'SB', 'SC', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SR', 'ST', 'SV', 'SX', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TO', 'TR', 'TV', 'TW', 'TZ', 'UA', 'UG', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'XK', 'YT', 'ZA', 'ZM', 'ZW');--> statement-breakpoint
CREATE TYPE "public"."gender" AS ENUM('MALE', 'FEMALE');--> statement-breakpoint
CREATE TYPE "public"."calendar_type" AS ENUM('GREGORIAN', 'HIJRI');--> statement-breakpoint
CREATE TYPE "public"."certificate_date_field" AS ENUM('RELEASE_DATE');--> statement-breakpoint
CREATE TYPE "public"."certificate_text_field" AS ENUM('VERIFICATION_CODE');--> statement-breakpoint
CREATE TYPE "public"."country_representation" AS ENUM('COUNTRY_NAME', 'NATIONALITY');--> statement-breakpoint
CREATE TYPE "public"."date_data_source_type" AS ENUM('STATIC', 'TEMPLATE_DATE_VARIABLE', 'STUDENT_DATE_FIELD', 'CERTIFICATE_DATE_FIELD');--> statement-breakpoint
CREATE TYPE "public"."date_transformation_type" AS ENUM('AGE_CALCULATION');--> statement-breakpoint
CREATE TYPE "public"."element_alignment" AS ENUM('TOP_START', 'TOP_CENTER', 'TOP_END', 'CENTER_START', 'CENTER', 'CENTER_END', 'BOTTOM_START', 'BOTTOM_CENTER', 'BOTTOM_END', 'BASELINE_START', 'BASELINE_CENTER', 'BASELINE_END');--> statement-breakpoint
CREATE TYPE "public"."element_image_fit" AS ENUM('COVER', 'CONTAIN', 'FILL');--> statement-breakpoint
CREATE TYPE "public"."element_overflow" AS ENUM('RESIZE_DOWN', 'TRUNCATE', 'ELLIPSE', 'WRAP');--> statement-breakpoint
CREATE TYPE "public"."element_type" AS ENUM('TEXT', 'NUMBER', 'DATE', 'IMAGE', 'GENDER', 'COUNTRY', 'QR_CODE');--> statement-breakpoint
CREATE TYPE "public"."font_source" AS ENUM('GOOGLE', 'SELF_HOSTED');--> statement-breakpoint
CREATE TYPE "public"."google_font_family" AS ENUM('ABeeZee', 'Abel', 'Abhaya Libre', 'Aboreto', 'Abril Fatface', 'Abyssinica SIL', 'Aclonica', 'Acme', 'Actor', 'Adamina', 'ADLaM Display', 'Advent Pro', 'Afacad', 'Afacad Flux', 'Agbalumo', 'Agdasima', 'Agu Display', 'Aguafina Script', 'Akatab', 'Akaya Kanadaka', 'Akaya Telivigala', 'Akronim', 'Akshar', 'Aladin', 'Alan Sans', 'Alata', 'Alatsi', 'Albert Sans', 'Aldrich', 'Alef', 'Alegreya', 'Alegreya Sans', 'Alegreya Sans SC', 'Alegreya SC', 'Aleo', 'Alex Brush', 'Alexandria', 'Alfa Slab One', 'Alice', 'Alike', 'Alike Angular', 'Alkalami', 'Alkatra', 'Allan', 'Allerta', 'Allerta Stencil', 'Allison', 'Allura', 'Almarai', 'Almendra', 'Almendra Display', 'Almendra SC', 'Alumni Sans', 'Alumni Sans Collegiate One', 'Alumni Sans Inline One', 'Alumni Sans Pinstripe', 'Alumni Sans SC', 'Amarante', 'Amaranth', 'Amatic SC', 'Amethysta', 'Amiko', 'Amiri', 'Amiri Quran', 'Amita', 'Anaheim', 'Ancizar Sans', 'Ancizar Serif', 'Andada Pro', 'Andika', 'Anek Bangla', 'Anek Devanagari', 'Anek Gujarati', 'Anek Gurmukhi', 'Anek Kannada', 'Anek Latin', 'Anek Malayalam', 'Anek Odia', 'Anek Tamil', 'Anek Telugu', 'Angkor', 'Annapurna SIL', 'Annie Use Your Telescope', 'Anonymous Pro', 'Anta', 'Antic', 'Antic Didone', 'Antic Slab', 'Anton', 'Anton SC', 'Antonio', 'Anuphan', 'Anybody', 'Aoboshi One', 'AR One Sans', 'Arapey', 'Arbutus', 'Arbutus Slab', 'Architects Daughter', 'Archivo', 'Archivo Black', 'Archivo Narrow', 'Are You Serious', 'Aref Ruqaa', 'Aref Ruqaa Ink', 'Arima', 'Arimo', 'Arizonia', 'Armata', 'Arsenal', 'Arsenal SC', 'Artifika', 'Arvo', 'Arya', 'Asap', 'Asap Condensed', 'Asar', 'Asimovian', 'Asset', 'Assistant', 'Asta Sans', 'Astloch', 'Asul', 'Athiti', 'Atkinson Hyperlegible', 'Atkinson Hyperlegible Mono', 'Atkinson Hyperlegible Next', 'Atma', 'Atomic Age', 'Aubrey', 'Audiowide', 'Autour One', 'Average', 'Average Sans', 'Averia Gruesa Libre', 'Averia Libre', 'Averia Sans Libre', 'Averia Serif Libre', 'Azeret Mono', 'B612', 'B612 Mono', 'Babylonica', 'Bacasime Antique', 'Bad Script', 'Badeen Display', 'Bagel Fat One', 'Bahiana', 'Bahianita', 'Bai Jamjuree', 'Bakbak One', 'Ballet', 'Baloo 2', 'Baloo Bhai 2', 'Baloo Bhaijaan 2', 'Baloo Bhaina 2', 'Baloo Chettan 2', 'Baloo Da 2', 'Baloo Paaji 2', 'Baloo Tamma 2', 'Baloo Tammudu 2', 'Baloo Thambi 2', 'Balsamiq Sans', 'Balthazar', 'Bangers', 'Barlow', 'Barlow Condensed', 'Barlow Semi Condensed', 'Barriecito', 'Barrio', 'Basic', 'Baskervville', 'Baskervville SC', 'Battambang', 'Baumans', 'Bayon', 'BBH Sans Bartle', 'BBH Sans Bogle', 'BBH Sans Hegarty', 'Be Vietnam Pro', 'Beau Rivage', 'Bebas Neue', 'Beiruti', 'Belanosima', 'Belgrano', 'Bellefair', 'Belleza', 'Bellota', 'Bellota Text', 'BenchNine', 'Benne', 'Bentham', 'Berkshire Swash', 'Besley', 'Beth Ellen', 'Bevan', 'BhuTuka Expanded One', 'Big Shoulders', 'Big Shoulders Inline', 'Big Shoulders Stencil', 'Bigelow Rules', 'Bigshot One', 'Bilbo', 'Bilbo Swash Caps', 'BioRhyme', 'BioRhyme Expanded', 'Birthstone', 'Birthstone Bounce', 'Biryani', 'Bitcount', 'Bitcount Grid Double', 'Bitcount Grid Double Ink', 'Bitcount Grid Single', 'Bitcount Grid Single Ink', 'Bitcount Ink', 'Bitcount Prop Double', 'Bitcount Prop Double Ink', 'Bitcount Prop Single', 'Bitcount Prop Single Ink', 'Bitcount Single', 'Bitcount Single Ink', 'Bitter', 'BIZ UDGothic', 'BIZ UDMincho', 'BIZ UDPGothic', 'BIZ UDPMincho', 'Black And White Picture', 'Black Han Sans', 'Black Ops One', 'Blaka', 'Blaka Hollow', 'Blaka Ink', 'Blinker', 'Bodoni Moda', 'Bodoni Moda SC', 'Bokor', 'Boldonse', 'Bona Nova', 'Bona Nova SC', 'Bonbon', 'Bonheur Royale', 'Boogaloo', 'Borel', 'Bowlby One', 'Bowlby One SC', 'Braah One', 'Brawler', 'Bree Serif', 'Bricolage Grotesque', 'Bruno Ace', 'Bruno Ace SC', 'Brygada 1918', 'Bubblegum Sans', 'Bubbler One', 'Buda', 'Buenard', 'Bungee', 'Bungee Hairline', 'Bungee Inline', 'Bungee Outline', 'Bungee Shade', 'Bungee Spice', 'Bungee Tint', 'Butcherman', 'Butterfly Kids', 'Bytesized', 'Cabin', 'Cabin Condensed', 'Cabin Sketch', 'Cactus Classical Serif', 'Caesar Dressing', 'Cagliostro', 'Cairo', 'Cairo Play', 'Cal Sans', 'Caladea', 'Calistoga', 'Calligraffitti', 'Cambay', 'Cambo', 'Candal', 'Cantarell', 'Cantata One', 'Cantora One', 'Caprasimo', 'Capriola', 'Caramel', 'Carattere', 'Cardo', 'Carlito', 'Carme', 'Carrois Gothic', 'Carrois Gothic SC', 'Carter One', 'Cascadia Code', 'Cascadia Mono', 'Castoro', 'Castoro Titling', 'Catamaran', 'Caudex', 'Caveat', 'Caveat Brush', 'Cedarville Cursive', 'Ceviche One', 'Chakra Petch', 'Changa', 'Changa One', 'Chango', 'Charis SIL', 'Charm', 'Charmonman', 'Chathura', 'Chau Philomene One', 'Chela One', 'Chelsea Market', 'Chenla', 'Cherish', 'Cherry Bomb One', 'Cherry Cream Soda', 'Cherry Swash', 'Chewy', 'Chicle', 'Chilanka', 'Chiron GoRound TC', 'Chiron Hei HK', 'Chiron Sung HK', 'Chivo', 'Chivo Mono', 'Chocolate Classical Sans', 'Chokokutai', 'Chonburi', 'Cinzel', 'Cinzel Decorative', 'Clicker Script', 'Climate Crisis', 'Coda', 'Codystar', 'Coiny', 'Combo', 'Comfortaa', 'Comforter', 'Comforter Brush', 'Comic Neue', 'Comic Relief', 'Coming Soon', 'Comme', 'Commissioner', 'Concert One', 'Condiment', 'Content', 'Contrail One', 'Convergence', 'Cookie', 'Copse', 'Coral Pixels', 'Corben', 'Corinthia', 'Cormorant', 'Cormorant Garamond', 'Cormorant Infant', 'Cormorant SC', 'Cormorant Unicase', 'Cormorant Upright', 'Cossette Texte', 'Cossette Titre', 'Courgette', 'Courier Prime', 'Cousine', 'Coustard', 'Covered By Your Grace', 'Crafty Girls', 'Creepster', 'Crete Round', 'Crimson Pro', 'Crimson Text', 'Croissant One', 'Crushed', 'Cuprum', 'Cute Font', 'Cutive', 'Cutive Mono', 'Dai Banna SIL', 'Damion', 'Dancing Script', 'Danfo', 'Dangrek', 'Darker Grotesque', 'Darumadrop One', 'David Libre', 'Dawning of a New Day', 'Days One', 'Dekko', 'Dela Gothic One', 'Delicious Handrawn', 'Delius', 'Delius Swash Caps', 'Delius Unicase', 'Della Respira', 'Denk One', 'Devonshire', 'Dhurjati', 'Didact Gothic', 'Diphylleia', 'Diplomata', 'Diplomata SC', 'DM Mono', 'DM Sans', 'DM Serif Display', 'DM Serif Text', 'Do Hyeon', 'Dokdo', 'Domine', 'Donegal One', 'Dongle', 'Doppio One', 'Dorsa', 'Dosis', 'DotGothic16', 'Doto', 'Dr Sugiyama', 'Duru Sans', 'Dynalight', 'DynaPuff', 'Eagle Lake', 'East Sea Dokdo', 'Eater', 'EB Garamond', 'Economica', 'Eczar', 'Edu AU VIC WA NT Arrows', 'Edu AU VIC WA NT Dots', 'Edu AU VIC WA NT Guides', 'Edu AU VIC WA NT Hand', 'Edu AU VIC WA NT Pre', 'Edu NSW ACT Cursive', 'Edu NSW ACT Foundation', 'Edu NSW ACT Hand Pre', 'Edu QLD Beginner', 'Edu QLD Hand', 'Edu SA Beginner', 'Edu SA Hand', 'Edu TAS Beginner', 'Edu VIC WA NT Beginner', 'Edu VIC WA NT Hand', 'Edu VIC WA NT Hand Pre', 'El Messiri', 'Electrolize', 'Elsie', 'Elsie Swash Caps', 'Emblema One', 'Emilys Candy', 'Encode Sans', 'Encode Sans Condensed', 'Encode Sans Expanded', 'Encode Sans SC', 'Encode Sans Semi Condensed', 'Encode Sans Semi Expanded', 'Engagement', 'Englebert', 'Enriqueta', 'Ephesis', 'Epilogue', 'Epunda Sans', 'Epunda Slab', 'Erica One', 'Esteban', 'Estonia', 'Euphoria Script', 'Ewert', 'Exile', 'Exo', 'Exo 2', 'Expletus Sans', 'Explora', 'Faculty Glyphic', 'Fahkwang', 'Familjen Grotesk', 'Fanwood Text', 'Farro', 'Farsan', 'Fascinate', 'Fascinate Inline', 'Faster One', 'Fasthand', 'Fauna One', 'Faustina', 'Federant', 'Federo', 'Felipa', 'Fenix', 'Festive', 'Figtree', 'Finger Paint', 'Finlandica', 'Fira Code', 'Fira Mono', 'Fira Sans', 'Fira Sans Condensed', 'Fira Sans Extra Condensed', 'Fjalla One', 'Fjord One', 'Flamenco', 'Flavors', 'Fleur De Leah', 'Flow Block', 'Flow Circular', 'Flow Rounded', 'Foldit', 'Fondamento', 'Fontdiner Swanky', 'Forum', 'Fragment Mono', 'Francois One', 'Frank Ruhl Libre', 'Fraunces', 'Freckle Face', 'Fredericka the Great', 'Fredoka', 'Freehand', 'Freeman', 'Fresca', 'Frijole', 'Fruktur', 'Fugaz One', 'Fuggles', 'Funnel Display', 'Funnel Sans', 'Fustat', 'Fuzzy Bubbles', 'Ga Maamli', 'Gabarito', 'Gabriela', 'Gaegu', 'Gafata', 'Gajraj One', 'Galada', 'Galdeano', 'Galindo', 'Gamja Flower', 'Gantari', 'Gasoek One', 'Gayathri', 'Geist', 'Geist Mono', 'Gelasio', 'Gemunu Libre', 'Genos', 'Gentium Book Plus', 'Gentium Plus', 'Geo', 'Geologica', 'Georama', 'Geostar', 'Geostar Fill', 'Germania One', 'GFS Didot', 'GFS Neohellenic', 'Gideon Roman', 'Gidole', 'Gidugu', 'Gilda Display', 'Girassol', 'Give You Glory', 'Glass Antiqua', 'Glegoo', 'Gloock', 'Gloria Hallelujah', 'Glory', 'Gluten', 'Goblin One', 'Gochi Hand', 'Goldman', 'Golos Text', 'Google Sans Code', 'Gorditas', 'Gothic A1', 'Gotu', 'Goudy Bookletter 1911', 'Gowun Batang', 'Gowun Dodum', 'Graduate', 'Grand Hotel', 'Grandiflora One', 'Grandstander', 'Grape Nuts', 'Gravitas One', 'Great Vibes', 'Grechen Fuemen', 'Grenze', 'Grenze Gotisch', 'Grey Qo', 'Griffy', 'Gruppo', 'Gudea', 'Gugi', 'Gulzar', 'Gupter', 'Gurajada', 'Gwendolyn', 'Habibi', 'Hachi Maru Pop', 'Hahmlet', 'Halant', 'Hammersmith One', 'Hanalei', 'Hanalei Fill', 'Handjet', 'Handlee', 'Hanken Grotesk', 'Hanuman', 'Happy Monkey', 'Harmattan', 'Headland One', 'Hedvig Letters Sans', 'Hedvig Letters Serif', 'Heebo', 'Henny Penny', 'Hepta Slab', 'Herr Von Muellerhoff', 'Hi Melody', 'Hina Mincho', 'Hind', 'Hind Guntur', 'Hind Madurai', 'Hind Mysuru', 'Hind Siliguri', 'Hind Vadodara', 'Holtwood One SC', 'Homemade Apple', 'Homenaje', 'Honk', 'Host Grotesk', 'Hubballi', 'Hubot Sans', 'Huninn', 'Hurricane', 'Iansui', 'Ibarra Real Nova', 'IBM Plex Mono', 'IBM Plex Sans', 'IBM Plex Sans Arabic', 'IBM Plex Sans Condensed', 'IBM Plex Sans Devanagari', 'IBM Plex Sans Hebrew', 'IBM Plex Sans JP', 'IBM Plex Sans KR', 'IBM Plex Sans Thai', 'IBM Plex Sans Thai Looped', 'IBM Plex Serif', 'Iceberg', 'Iceland', 'IM Fell Double Pica', 'IM Fell Double Pica SC', 'IM Fell DW Pica', 'IM Fell DW Pica SC', 'IM Fell English', 'IM Fell English SC', 'IM Fell French Canon', 'IM Fell French Canon SC', 'IM Fell Great Primer', 'IM Fell Great Primer SC', 'Imbue', 'Imperial Script', 'Imprima', 'Inclusive Sans', 'Inconsolata', 'Inder', 'Indie Flower', 'Ingrid Darling', 'Inika', 'Inknut Antiqua', 'Inria Sans', 'Inria Serif', 'Inspiration', 'Instrument Sans', 'Instrument Serif', 'Intel One Mono', 'Inter', 'Inter Tight', 'Irish Grover', 'Island Moments', 'Istok Web', 'Italiana', 'Italianno', 'Itim', 'Jacquard 12', 'Jacquard 12 Charted', 'Jacquard 24', 'Jacquard 24 Charted', 'Jacquarda Bastarda 9', 'Jacquarda Bastarda 9 Charted', 'Jacques Francois', 'Jacques Francois Shadow', 'Jaini', 'Jaini Purva', 'Jaldi', 'Jaro', 'Jersey 10', 'Jersey 10 Charted', 'Jersey 15', 'Jersey 15 Charted', 'Jersey 20', 'Jersey 20 Charted', 'Jersey 25', 'Jersey 25 Charted', 'JetBrains Mono', 'Jim Nightshade', 'Joan', 'Jockey One', 'Jolly Lodger', 'Jomhuria', 'Jomolhari', 'Josefin Sans', 'Josefin Slab', 'Jost', 'Joti One', 'Jua', 'Judson', 'Julee', 'Julius Sans One', 'Junge', 'Jura', 'Just Another Hand', 'Just Me Again Down Here', 'K2D', 'Kablammo', 'Kadwa', 'Kaisei Decol', 'Kaisei HarunoUmi', 'Kaisei Opti', 'Kaisei Tokumin', 'Kalam', 'Kalnia', 'Kalnia Glaze', 'Kameron', 'Kanchenjunga', 'Kanit', 'Kantumruy Pro', 'Kapakana', 'Karantina', 'Karla', 'Karla Tamil Inclined', 'Karla Tamil Upright', 'Karma', 'Katibeh', 'Kaushan Script', 'Kavivanar', 'Kavoon', 'Kay Pho Du', 'Kdam Thmor Pro', 'Keania One', 'Kelly Slab', 'Kenia', 'Khand', 'Khmer', 'Khula', 'Kings', 'Kirang Haerang', 'Kite One', 'Kiwi Maru', 'Klee One', 'Knewave', 'Kodchasan', 'Kode Mono', 'Koh Santepheap', 'KoHo', 'Kolker Brush', 'Konkhmer Sleokchher', 'Kosugi', 'Kosugi Maru', 'Kotta One', 'Koulen', 'Kranky', 'Kreon', 'Kristi', 'Krona One', 'Krub', 'Kufam', 'Kulim Park', 'Kumar One', 'Kumar One Outline', 'Kumbh Sans', 'Kurale', 'La Belle Aurore', 'Labrada', 'Lacquer', 'Laila', 'Lakki Reddy', 'Lalezar', 'Lancelot', 'Langar', 'Lateef', 'Lato', 'Lavishly Yours', 'League Gothic', 'League Script', 'League Spartan', 'Leckerli One', 'Ledger', 'Lekton', 'Lemon', 'Lemonada', 'Lexend', 'Lexend Deca', 'Lexend Exa', 'Lexend Giga', 'Lexend Mega', 'Lexend Peta', 'Lexend Tera', 'Lexend Zetta', 'Libertinus Keyboard', 'Libertinus Math', 'Libertinus Mono', 'Libertinus Sans', 'Libertinus Serif', 'Libertinus Serif Display', 'Libre Barcode 128', 'Libre Barcode 128 Text', 'Libre Barcode 39', 'Libre Barcode 39 Extended', 'Libre Barcode 39 Extended Text', 'Libre Barcode 39 Text', 'Libre Barcode EAN13 Text', 'Libre Baskerville', 'Libre Bodoni', 'Libre Caslon Display', 'Libre Caslon Text', 'Libre Franklin', 'Licorice', 'Life Savers', 'Lilita One', 'Lily Script One', 'Limelight', 'Linden Hill', 'Linefont', 'Lisu Bosa', 'Liter', 'Literata', 'Liu Jian Mao Cao', 'Livvic', 'Lobster', 'Lobster Two', 'Londrina Outline', 'Londrina Shadow', 'Londrina Sketch', 'Londrina Solid', 'Long Cang', 'Lora', 'Love Light', 'Love Ya Like A Sister', 'Loved by the King', 'Lovers Quarrel', 'Luckiest Guy', 'Lugrasimo', 'Lumanosimo', 'Lunasima', 'Lusitana', 'Lustria', 'Luxurious Roman', 'Luxurious Script', 'LXGW Marker Gothic', 'LXGW WenKai Mono TC', 'LXGW WenKai TC', 'M PLUS 1', 'M PLUS 1 Code', 'M PLUS 1p', 'M PLUS 2', 'M PLUS Code Latin', 'M PLUS Rounded 1c', 'Ma Shan Zheng', 'Macondo', 'Macondo Swash Caps', 'Mada', 'Madimi One', 'Magra', 'Maiden Orange', 'Maitree', 'Major Mono Display', 'Mako', 'Mali', 'Mallanna', 'Maname', 'Mandali', 'Manjari', 'Manrope', 'Mansalva', 'Manuale', 'Manufacturing Consent', 'Marcellus', 'Marcellus SC', 'Marck Script', 'Margarine', 'Marhey', 'Markazi Text', 'Marko One', 'Marmelad', 'Martel', 'Martel Sans', 'Martian Mono', 'Marvel', 'Matangi', 'Mate', 'Mate SC', 'Matemasie', 'Material Icons', 'Material Icons Outlined', 'Material Icons Round', 'Material Icons Sharp', 'Material Icons Two Tone', 'Material Symbols', 'Material Symbols Outlined', 'Material Symbols Rounded', 'Material Symbols Sharp', 'Maven Pro', 'McLaren', 'Mea Culpa', 'Meddon', 'MedievalSharp', 'Medula One', 'Meera Inimai', 'Megrim', 'Meie Script', 'Menbere', 'Meow Script', 'Merienda', 'Merriweather', 'Merriweather Sans', 'Metal', 'Metal Mania', 'Metamorphous', 'Metrophobic', 'Michroma', 'Micro 5', 'Micro 5 Charted', 'Milonga', 'Miltonian', 'Miltonian Tattoo', 'Mina', 'Mingzat', 'Miniver', 'Miriam Libre', 'Mirza', 'Miss Fajardose', 'Mitr', 'Mochiy Pop One', 'Mochiy Pop P One', 'Modak', 'Modern Antiqua', 'Moderustic', 'Mogra', 'Mohave', 'Moirai One', 'Molengo', 'Molle', 'Momo Signature', 'Momo Trust Display', 'Momo Trust Sans', 'Mona Sans', 'Monda', 'Monofett', 'Monomakh', 'Monomaniac One', 'Monoton', 'Monsieur La Doulaise', 'Montaga', 'Montagu Slab', 'MonteCarlo', 'Montez', 'Montserrat', 'Montserrat Alternates', 'Montserrat Underline', 'Moo Lah Lah', 'Mooli', 'Moon Dance', 'Moul', 'Moulpali', 'Mountains of Christmas', 'Mouse Memoirs', 'Mozilla Headline', 'Mozilla Text', 'Mr Bedfort', 'Mr Dafoe', 'Mr De Haviland', 'Mrs Saint Delafield', 'Mrs Sheppards', 'Ms Madi', 'Mukta', 'Mukta Mahee', 'Mukta Malar', 'Mukta Vaani', 'Mulish', 'Murecho', 'MuseoModerno', 'My Soul', 'Mynerve', 'Mystery Quest', 'Nabla', 'Namdhinggo', 'Nanum Brush Script', 'Nanum Gothic', 'Nanum Gothic Coding', 'Nanum Myeongjo', 'Nanum Pen Script', 'Narnoor', 'Nata Sans', 'National Park', 'Neonderthaw', 'Nerko One', 'Neucha', 'Neuton', 'New Amsterdam', 'New Rocker', 'New Tegomin', 'News Cycle', 'Newsreader', 'Niconne', 'Niramit', 'Nixie One', 'Nobile', 'Nokora', 'Norican', 'Nosifer', 'Notable', 'Nothing You Could Do', 'Noticia Text', 'Noto Color Emoji', 'Noto Emoji', 'Noto Kufi Arabic', 'Noto Music', 'Noto Naskh Arabic', 'Noto Nastaliq Urdu', 'Noto Rashi Hebrew', 'Noto Sans', 'Noto Sans Adlam', 'Noto Sans Adlam Unjoined', 'Noto Sans Anatolian Hieroglyphs', 'Noto Sans Arabic', 'Noto Sans Armenian', 'Noto Sans Avestan', 'Noto Sans Balinese', 'Noto Sans Bamum', 'Noto Sans Bassa Vah', 'Noto Sans Batak', 'Noto Sans Bengali', 'Noto Sans Bhaiksuki', 'Noto Sans Brahmi', 'Noto Sans Buginese', 'Noto Sans Buhid', 'Noto Sans Canadian Aboriginal', 'Noto Sans Carian', 'Noto Sans Caucasian Albanian', 'Noto Sans Chakma', 'Noto Sans Cham', 'Noto Sans Cherokee', 'Noto Sans Chorasmian', 'Noto Sans Coptic', 'Noto Sans Cuneiform', 'Noto Sans Cypriot', 'Noto Sans Cypro Minoan', 'Noto Sans Deseret', 'Noto Sans Devanagari', 'Noto Sans Display', 'Noto Sans Duployan', 'Noto Sans Egyptian Hieroglyphs', 'Noto Sans Elbasan', 'Noto Sans Elymaic', 'Noto Sans Ethiopic', 'Noto Sans Georgian', 'Noto Sans Glagolitic', 'Noto Sans Gothic', 'Noto Sans Grantha', 'Noto Sans Gujarati', 'Noto Sans Gunjala Gondi', 'Noto Sans Gurmukhi', 'Noto Sans Hanifi Rohingya', 'Noto Sans Hanunoo', 'Noto Sans Hatran', 'Noto Sans Hebrew', 'Noto Sans HK', 'Noto Sans Imperial Aramaic', 'Noto Sans Indic Siyaq Numbers', 'Noto Sans Inscriptional Pahlavi', 'Noto Sans Inscriptional Parthian', 'Noto Sans Javanese', 'Noto Sans JP', 'Noto Sans Kaithi', 'Noto Sans Kannada', 'Noto Sans Kawi', 'Noto Sans Kayah Li', 'Noto Sans Kharoshthi', 'Noto Sans Khmer', 'Noto Sans Khojki', 'Noto Sans Khudawadi', 'Noto Sans KR', 'Noto Sans Lao', 'Noto Sans Lao Looped', 'Noto Sans Lepcha', 'Noto Sans Limbu', 'Noto Sans Linear A', 'Noto Sans Linear B', 'Noto Sans Lisu', 'Noto Sans Lycian', 'Noto Sans Lydian', 'Noto Sans Mahajani', 'Noto Sans Malayalam', 'Noto Sans Mandaic', 'Noto Sans Manichaean', 'Noto Sans Marchen', 'Noto Sans Masaram Gondi', 'Noto Sans Math', 'Noto Sans Mayan Numerals', 'Noto Sans Medefaidrin', 'Noto Sans Meetei Mayek', 'Noto Sans Mende Kikakui', 'Noto Sans Meroitic', 'Noto Sans Miao', 'Noto Sans Modi', 'Noto Sans Mongolian', 'Noto Sans Mono', 'Noto Sans Mro', 'Noto Sans Multani', 'Noto Sans Myanmar', 'Noto Sans Nabataean', 'Noto Sans Nag Mundari', 'Noto Sans Nandinagari', 'Noto Sans New Tai Lue', 'Noto Sans Newa', 'Noto Sans NKo', 'Noto Sans NKo Unjoined', 'Noto Sans Nushu', 'Noto Sans Ogham', 'Noto Sans Ol Chiki', 'Noto Sans Old Hungarian', 'Noto Sans Old Italic', 'Noto Sans Old North Arabian', 'Noto Sans Old Permic', 'Noto Sans Old Persian', 'Noto Sans Old Sogdian', 'Noto Sans Old South Arabian', 'Noto Sans Old Turkic', 'Noto Sans Oriya', 'Noto Sans Osage', 'Noto Sans Osmanya', 'Noto Sans Pahawh Hmong', 'Noto Sans Palmyrene', 'Noto Sans Pau Cin Hau', 'Noto Sans PhagsPa', 'Noto Sans Phoenician', 'Noto Sans Psalter Pahlavi', 'Noto Sans Rejang', 'Noto Sans Runic', 'Noto Sans Samaritan', 'Noto Sans Saurashtra', 'Noto Sans SC', 'Noto Sans Sharada', 'Noto Sans Shavian', 'Noto Sans Siddham', 'Noto Sans SignWriting', 'Noto Sans Sinhala', 'Noto Sans Sogdian', 'Noto Sans Sora Sompeng', 'Noto Sans Soyombo', 'Noto Sans Sundanese', 'Noto Sans Sunuwar', 'Noto Sans Syloti Nagri', 'Noto Sans Symbols', 'Noto Sans Symbols 2', 'Noto Sans Syriac', 'Noto Sans Syriac Eastern', 'Noto Sans Syriac Western', 'Noto Sans Tagalog', 'Noto Sans Tagbanwa', 'Noto Sans Tai Le', 'Noto Sans Tai Tham', 'Noto Sans Tai Viet', 'Noto Sans Takri', 'Noto Sans Tamil', 'Noto Sans Tamil Supplement', 'Noto Sans Tangsa', 'Noto Sans TC', 'Noto Sans Telugu', 'Noto Sans Thaana', 'Noto Sans Thai', 'Noto Sans Thai Looped', 'Noto Sans Tifinagh', 'Noto Sans Tirhuta', 'Noto Sans Ugaritic', 'Noto Sans Vai', 'Noto Sans Vithkuqi', 'Noto Sans Wancho', 'Noto Sans Warang Citi', 'Noto Sans Yi', 'Noto Sans Zanabazar Square', 'Noto Serif', 'Noto Serif Ahom', 'Noto Serif Armenian', 'Noto Serif Balinese', 'Noto Serif Bengali', 'Noto Serif Devanagari', 'Noto Serif Display', 'Noto Serif Dives Akuru', 'Noto Serif Dogra', 'Noto Serif Ethiopic', 'Noto Serif Georgian', 'Noto Serif Grantha', 'Noto Serif Gujarati', 'Noto Serif Gurmukhi', 'Noto Serif Hebrew', 'Noto Serif Hentaigana', 'Noto Serif HK', 'Noto Serif JP', 'Noto Serif Kannada', 'Noto Serif Khitan Small Script', 'Noto Serif Khmer', 'Noto Serif Khojki', 'Noto Serif KR', 'Noto Serif Lao', 'Noto Serif Makasar', 'Noto Serif Malayalam', 'Noto Serif Myanmar', 'Noto Serif NP Hmong', 'Noto Serif Old Uyghur', 'Noto Serif Oriya', 'Noto Serif Ottoman Siyaq', 'Noto Serif SC', 'Noto Serif Sinhala', 'Noto Serif Tamil', 'Noto Serif Tangut', 'Noto Serif TC', 'Noto Serif Telugu', 'Noto Serif Thai', 'Noto Serif Tibetan', 'Noto Serif Todhri', 'Noto Serif Toto', 'Noto Serif Vithkuqi', 'Noto Serif Yezidi', 'Noto Traditional Nushu', 'Noto Znamenny Musical Notation', 'Nova Cut', 'Nova Flat', 'Nova Mono', 'Nova Oval', 'Nova Round', 'Nova Script', 'Nova Slim', 'Nova Square', 'NTR', 'Numans', 'Nunito', 'Nunito Sans', 'Nuosu SIL', 'Odibee Sans', 'Odor Mean Chey', 'Offside', 'Oi', 'Ojuju', 'Old Standard TT', 'Oldenburg', 'Ole', 'Oleo Script', 'Oleo Script Swash Caps', 'Onest', 'Oooh Baby', 'Open Sans', 'Oranienbaum', 'Orbit', 'Orbitron', 'Oregano', 'Orelega One', 'Orienta', 'Original Surfer', 'Oswald', 'Outfit', 'Over the Rainbow', 'Overlock', 'Overlock SC', 'Overpass', 'Overpass Mono', 'Ovo', 'Oxanium', 'Oxygen', 'Oxygen Mono', 'Pacifico', 'Padauk', 'Padyakke Expanded One', 'Palanquin', 'Palanquin Dark', 'Palette Mosaic', 'Pangolin', 'Paprika', 'Parastoo', 'Parisienne', 'Parkinsans', 'Passero One', 'Passion One', 'Passions Conflict', 'Pathway Extreme', 'Pathway Gothic One', 'Patrick Hand', 'Patrick Hand SC', 'Pattaya', 'Patua One', 'Pavanam', 'Paytone One', 'Peddana', 'Peralta', 'Permanent Marker', 'Petemoss', 'Petit Formal Script', 'Petrona', 'Phetsarath', 'Philosopher', 'Phudu', 'Piazzolla', 'Piedra', 'Pinyon Script', 'Pirata One', 'Pixelify Sans', 'Plaster', 'Platypi', 'Play', 'Playball', 'Playfair', 'Playfair Display', 'Playfair Display SC', 'Playpen Sans', 'Playpen Sans Arabic', 'Playpen Sans Deva', 'Playpen Sans Hebrew', 'Playpen Sans Thai', 'Playwrite AR', 'Playwrite AR Guides', 'Playwrite AT', 'Playwrite AT Guides', 'Playwrite AU NSW', 'Playwrite AU NSW Guides', 'Playwrite AU QLD', 'Playwrite AU QLD Guides', 'Playwrite AU SA', 'Playwrite AU SA Guides', 'Playwrite AU TAS', 'Playwrite AU TAS Guides', 'Playwrite AU VIC', 'Playwrite AU VIC Guides', 'Playwrite BE VLG', 'Playwrite BE VLG Guides', 'Playwrite BE WAL', 'Playwrite BE WAL Guides', 'Playwrite BR', 'Playwrite BR Guides', 'Playwrite CA', 'Playwrite CA Guides', 'Playwrite CL', 'Playwrite CL Guides', 'Playwrite CO', 'Playwrite CO Guides', 'Playwrite CU', 'Playwrite CU Guides', 'Playwrite CZ', 'Playwrite CZ Guides', 'Playwrite DE Grund', 'Playwrite DE Grund Guides', 'Playwrite DE LA', 'Playwrite DE LA Guides', 'Playwrite DE SAS', 'Playwrite DE SAS Guides', 'Playwrite DE VA', 'Playwrite DE VA Guides', 'Playwrite DK Loopet', 'Playwrite DK Loopet Guides', 'Playwrite DK Uloopet', 'Playwrite DK Uloopet Guides', 'Playwrite ES', 'Playwrite ES Deco', 'Playwrite ES Deco Guides', 'Playwrite ES Guides', 'Playwrite FR Moderne', 'Playwrite FR Moderne Guides', 'Playwrite FR Trad', 'Playwrite FR Trad Guides', 'Playwrite GB J', 'Playwrite GB J Guides', 'Playwrite GB S', 'Playwrite GB S Guides', 'Playwrite HR', 'Playwrite HR Guides', 'Playwrite HR Lijeva', 'Playwrite HR Lijeva Guides', 'Playwrite HU', 'Playwrite HU Guides', 'Playwrite ID', 'Playwrite ID Guides', 'Playwrite IE', 'Playwrite IE Guides', 'Playwrite IN', 'Playwrite IN Guides', 'Playwrite IS', 'Playwrite IS Guides', 'Playwrite IT Moderna', 'Playwrite IT Moderna Guides', 'Playwrite IT Trad', 'Playwrite IT Trad Guides', 'Playwrite MX', 'Playwrite MX Guides', 'Playwrite NG Modern', 'Playwrite NG Modern Guides', 'Playwrite NL', 'Playwrite NL Guides', 'Playwrite NO', 'Playwrite NO Guides', 'Playwrite NZ', 'Playwrite NZ Guides', 'Playwrite PE', 'Playwrite PE Guides', 'Playwrite PL', 'Playwrite PL Guides', 'Playwrite PT', 'Playwrite PT Guides', 'Playwrite RO', 'Playwrite RO Guides', 'Playwrite SK', 'Playwrite SK Guides', 'Playwrite TZ', 'Playwrite TZ Guides', 'Playwrite US Modern', 'Playwrite US Modern Guides', 'Playwrite US Trad', 'Playwrite US Trad Guides', 'Playwrite VN', 'Playwrite VN Guides', 'Playwrite ZA', 'Playwrite ZA Guides', 'Plus Jakarta Sans', 'Pochaevsk', 'Podkova', 'Poetsen One', 'Poiret One', 'Poller One', 'Poltawski Nowy', 'Poly', 'Pompiere', 'Ponnala', 'Ponomar', 'Pontano Sans', 'Poor Story', 'Poppins', 'Port Lligat Sans', 'Port Lligat Slab', 'Potta One', 'Pragati Narrow', 'Praise', 'Prata', 'Preahvihear', 'Press Start 2P', 'Pridi', 'Princess Sofia', 'Prociono', 'Prompt', 'Prosto One', 'Protest Guerrilla', 'Protest Revolution', 'Protest Riot', 'Protest Strike', 'Proza Libre', 'PT Mono', 'PT Sans', 'PT Sans Caption', 'PT Sans Narrow', 'PT Serif', 'PT Serif Caption', 'Public Sans', 'Puppies Play', 'Puritan', 'Purple Purse', 'Qahiri', 'Quando', 'Quantico', 'Quattrocento', 'Quattrocento Sans', 'Questrial', 'Quicksand', 'Quintessential', 'Qwigley', 'Qwitcher Grypen', 'Racing Sans One', 'Radio Canada', 'Radio Canada Big', 'Radley', 'Rajdhani', 'Rakkas', 'Raleway', 'Raleway Dots', 'Ramabhadra', 'Ramaraja', 'Rambla', 'Rammetto One', 'Rampart One', 'Ranchers', 'Rancho', 'Ranga', 'Rasa', 'Rationale', 'Ravi Prakash', 'Readex Pro', 'Recursive', 'Red Hat Display', 'Red Hat Mono', 'Red Hat Text', 'Red Rose', 'Redacted', 'Redacted Script', 'Reddit Mono', 'Reddit Sans', 'Reddit Sans Condensed', 'Redressed', 'Reem Kufi', 'Reem Kufi Fun', 'Reem Kufi Ink', 'Reenie Beanie', 'Reggae One', 'REM', 'Rethink Sans', 'Revalia', 'Rhodium Libre', 'Ribeye', 'Ribeye Marrow', 'Righteous', 'Risque', 'Road Rage', 'Roboto', 'Roboto Condensed', 'Roboto Flex', 'Roboto Mono', 'Roboto Serif', 'Roboto Slab', 'Rochester', 'Rock 3D', 'Rock Salt', 'RocknRoll One', 'Rokkitt', 'Romanesco', 'Ropa Sans', 'Rosario', 'Rosarivo', 'Rouge Script', 'Rowdies', 'Rozha One', 'Rubik', 'Rubik 80s Fade', 'Rubik Beastly', 'Rubik Broken Fax', 'Rubik Bubbles', 'Rubik Burned', 'Rubik Dirt', 'Rubik Distressed', 'Rubik Doodle Shadow', 'Rubik Doodle Triangles', 'Rubik Gemstones', 'Rubik Glitch', 'Rubik Glitch Pop', 'Rubik Iso', 'Rubik Lines', 'Rubik Maps', 'Rubik Marker Hatch', 'Rubik Maze', 'Rubik Microbe', 'Rubik Mono One', 'Rubik Moonrocks', 'Rubik Pixels', 'Rubik Puddles', 'Rubik Scribble', 'Rubik Spray Paint', 'Rubik Storm', 'Rubik Vinyl', 'Rubik Wet Paint', 'Ruda', 'Rufina', 'Ruge Boogie', 'Ruluko', 'Rum Raisin', 'Ruslan Display', 'Russo One', 'Ruthie', 'Ruwudu', 'Rye', 'Sacramento', 'Sahitya', 'Sail', 'Saira', 'Saira Condensed', 'Saira Extra Condensed', 'Saira Semi Condensed', 'Saira Stencil One', 'Salsa', 'Sanchez', 'Sancreek', 'Sankofa Display', 'Sansation', 'Sansita', 'Sansita Swashed', 'Sarabun', 'Sarala', 'Sarina', 'Sarpanch', 'Sassy Frass', 'Satisfy', 'Savate', 'Sawarabi Gothic', 'Sawarabi Mincho', 'Scada', 'Scheherazade New', 'Schibsted Grotesk', 'Schoolbell', 'Scope One', 'Seaweed Script', 'Secular One', 'Sedan', 'Sedan SC', 'Sedgwick Ave', 'Sedgwick Ave Display', 'Sen', 'Send Flowers', 'Sevillana', 'Seymour One', 'Shadows Into Light', 'Shadows Into Light Two', 'Shafarik', 'Shalimar', 'Shantell Sans', 'Shanti', 'Share', 'Share Tech', 'Share Tech Mono', 'Shippori Antique', 'Shippori Antique B1', 'Shippori Mincho', 'Shippori Mincho B1', 'Shizuru', 'Shojumaru', 'Short Stack', 'Shrikhand', 'Siemreap', 'Sigmar', 'Sigmar One', 'Signika', 'Signika Negative', 'Silkscreen', 'Simonetta', 'Single Day', 'Sintony', 'Sirin Stencil', 'Sirivennela', 'Six Caps', 'Sixtyfour', 'Sixtyfour Convergence', 'Skranji', 'Slabo 13px', 'Slabo 27px', 'Slackey', 'Slackside One', 'Smokum', 'Smooch', 'Smooch Sans', 'Smythe', 'Sniglet', 'Snippet', 'Snowburst One', 'Sofadi One', 'Sofia', 'Sofia Sans', 'Sofia Sans Condensed', 'Sofia Sans Extra Condensed', 'Sofia Sans Semi Condensed', 'Solitreo', 'Solway', 'Sometype Mono', 'Song Myung', 'Sono', 'Sonsie One', 'Sora', 'Sorts Mill Goudy', 'Sour Gummy', 'Source Code Pro', 'Source Sans 3', 'Source Serif 4', 'Space Grotesk', 'Space Mono', 'Special Elite', 'Special Gothic', 'Special Gothic Condensed One', 'Special Gothic Expanded One', 'Spectral', 'Spectral SC', 'Spicy Rice', 'Spinnaker', 'Spirax', 'Splash', 'Spline Sans', 'Spline Sans Mono', 'Squada One', 'Square Peg', 'Sree Krushnadevaraya', 'Sriracha', 'Srisakdi', 'Staatliches', 'Stalemate', 'Stalinist One', 'Stardos Stencil', 'Stick', 'Stick No Bills', 'Stint Ultra Condensed', 'Stint Ultra Expanded', 'STIX Two Text', 'Stoke', 'Story Script', 'Strait', 'Style Script', 'Stylish', 'Sue Ellen Francisco', 'Suez One', 'Sulphur Point', 'Sumana', 'Sunflower', 'Sunshiney', 'Supermercado One', 'Sura', 'Suranna', 'Suravaram', 'SUSE', 'SUSE Mono', 'Suwannaphum', 'Swanky and Moo Moo', 'Syncopate', 'Syne', 'Syne Mono', 'Syne Tactile', 'Tac One', 'Tagesschrift', 'Tai Heritage Pro', 'Tajawal', 'Tangerine', 'Tapestry', 'Taprom', 'TASA Explorer', 'TASA Orbiter', 'Tauri', 'Taviraj', 'Teachers', 'Teko', 'Tektur', 'Telex', 'Tenali Ramakrishna', 'Tenor Sans', 'Text Me One', 'Texturina', 'Thasadith', 'The Girl Next Door', 'The Nautigal', 'Tienne', 'TikTok Sans', 'Tillana', 'Tilt Neon', 'Tilt Prism', 'Tilt Warp', 'Timmana', 'Tinos', 'Tiny5', 'Tiro Bangla', 'Tiro Devanagari Hindi', 'Tiro Devanagari Marathi', 'Tiro Devanagari Sanskrit', 'Tiro Gurmukhi', 'Tiro Kannada', 'Tiro Tamil', 'Tiro Telugu', 'Tirra', 'Titan One', 'Titillium Web', 'Tomorrow', 'Tourney', 'Trade Winds', 'Train One', 'Triodion', 'Trirong', 'Trispace', 'Trocchi', 'Trochut', 'Truculenta', 'Trykker', 'Tsukimi Rounded', 'Tuffy', 'Tulpen One', 'Turret Road', 'Twinkle Star', 'Ubuntu', 'Ubuntu Condensed', 'Ubuntu Mono', 'Ubuntu Sans', 'Ubuntu Sans Mono', 'Uchen', 'Ultra', 'Unbounded', 'Uncial Antiqua', 'Underdog', 'Unica One', 'UnifrakturCook', 'UnifrakturMaguntia', 'Unkempt', 'Unlock', 'Unna', 'UoqMunThenKhung', 'Updock', 'Urbanist', 'Vampiro One', 'Varela', 'Varela Round', 'Varta', 'Vast Shadow', 'Vazirmatn', 'Vend Sans', 'Vesper Libre', 'Viaoda Libre', 'Vibes', 'Vibur', 'Victor Mono', 'Vidaloka', 'Viga', 'Vina Sans', 'Voces', 'Volkhov', 'Vollkorn', 'Vollkorn SC', 'Voltaire', 'VT323', 'Vujahday Script', 'Waiting for the Sunrise', 'Wallpoet', 'Walter Turncoat', 'Warnes', 'Water Brush', 'Waterfall', 'Wavefont', 'WDXL Lubrifont JP N', 'WDXL Lubrifont SC', 'WDXL Lubrifont TC', 'Wellfleet', 'Wendy One', 'Whisper', 'WindSong', 'Winky Rough', 'Winky Sans', 'Wire One', 'Wittgenstein', 'Wix Madefor Display', 'Wix Madefor Text', 'Work Sans', 'Workbench', 'Xanh Mono', 'Yaldevi', 'Yanone Kaffeesatz', 'Yantramanav', 'Yarndings 12', 'Yarndings 12 Charted', 'Yarndings 20', 'Yarndings 20 Charted', 'Yatra One', 'Yellowtail', 'Yeon Sung', 'Yeseva One', 'Yesteryear', 'Yomogi', 'Young Serif', 'Yrsa', 'Ysabeau', 'Ysabeau Infant', 'Ysabeau Office', 'Ysabeau SC', 'Yuji Boku', 'Yuji Hentaigana Akari', 'Yuji Hentaigana Akebono', 'Yuji Mai', 'Yuji Syuku', 'Yusei Magic', 'Zain', 'Zalando Sans', 'Zalando Sans Expanded', 'Zalando Sans SemiExpanded', 'ZCOOL KuaiLe', 'ZCOOL QingKe HuangYou', 'ZCOOL XiaoWei', 'Zen Antique', 'Zen Antique Soft', 'Zen Dots', 'Zen Kaku Gothic Antique', 'Zen Kaku Gothic New', 'Zen Kurenaido', 'Zen Loop', 'Zen Maru Gothic', 'Zen Old Mincho', 'Zen Tokyo Zoo', 'Zeyada', 'Zhi Mang Xing', 'Zilla Slab', 'Zilla Slab Highlight');--> statement-breakpoint
CREATE TYPE "public"."qr_code_error_correction" AS ENUM('L', 'M', 'Q', 'H');--> statement-breakpoint
CREATE TYPE "public"."student_date_field" AS ENUM('DATE_OF_BIRTH');--> statement-breakpoint
CREATE TYPE "public"."student_text_field" AS ENUM('STUDENT_NAME', 'STUDENT_EMAIL');--> statement-breakpoint
CREATE TYPE "public"."template_variable_type" AS ENUM('TEXT', 'NUMBER', 'DATE', 'SELECT');--> statement-breakpoint
CREATE TYPE "public"."category_special_type" AS ENUM('Main', 'Suspension');--> statement-breakpoint
CREATE TYPE "public"."template_config_key" AS ENUM('MAX_BACKGROUND_SIZE', 'ALLOWED_FILE_TYPES');--> statement-breakpoint
CREATE TYPE "public"."text_data_source_type" AS ENUM('STATIC', 'TEMPLATE_TEXT_VARIABLE', 'TEMPLATE_SELECT_VARIABLE', 'STUDENT_TEXT_FIELD', 'CERTIFICATE_TEXT_FIELD');--> statement-breakpoint
CREATE TABLE "cache" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "certificate" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"template_recipient_group_id" integer NOT NULL,
	"release_date" timestamp (3) NOT NULL,
	"verification_code" varchar(255) NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL,
	CONSTRAINT "certificate_verification_code_unique" UNIQUE("verification_code")
);
--> statement-breakpoint
CREATE TABLE "font_variant" (
	"id" serial PRIMARY KEY NOT NULL,
	"family_id" bigint NOT NULL,
	"variant" varchar(100) NOT NULL,
	"storage_file_id" bigint NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "font_family" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category" varchar(50),
	"locale" jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "font_family_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "certificate_element" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"template_id" integer NOT NULL,
	"position_x" numeric NOT NULL,
	"position_y" numeric NOT NULL,
	"width" numeric NOT NULL,
	"height" numeric NOT NULL,
	"alignment" "element_alignment",
	"hidden" boolean DEFAULT false,
	"render_order" integer NOT NULL,
	"type" "element_type" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "country_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"text_props_id" integer NOT NULL,
	"representation" "country_representation" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "date_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"text_props_id" integer NOT NULL,
	"calendar_type" "calendar_type" NOT NULL,
	"offset_days" integer DEFAULT 0 NOT NULL,
	"format" varchar(100) NOT NULL,
	"transformation" date_transformation_type,
	"date_data_source" jsonb NOT NULL,
	"variable_id" integer
);
--> statement-breakpoint
CREATE TABLE "element_text_props" (
	"id" serial PRIMARY KEY NOT NULL,
	"font_source" "font_source" NOT NULL,
	"font_variant_id" integer,
	"google_font_family" "google_font_family",
	"google_font_variant" text,
	"font_size" integer NOT NULL,
	"color" varchar(50) NOT NULL,
	"overflow" "element_overflow" NOT NULL,
	CONSTRAINT "font_source_check" CHECK ((
        ("element_text_props"."font_source" = 'SELF_HOSTED' AND "element_text_props"."font_variant_id" IS NOT NULL AND "element_text_props"."google_font_family" IS NULL AND "element_text_props"."google_font_variant" IS NULL)
        OR
        ("element_text_props"."font_source" = 'GOOGLE' AND "element_text_props"."google_font_family" IS NOT NULL AND "element_text_props"."google_font_variant" IS NOT NULL AND "element_text_props"."font_variant_id" IS NULL)
      ))
);
--> statement-breakpoint
CREATE TABLE "file_usage" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"file_path" varchar(1024) NOT NULL,
	"usage_type" varchar(100) NOT NULL,
	"reference_id" bigint NOT NULL,
	"reference_table" varchar(100) NOT NULL,
	"created_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gender_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"text_props_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "image_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"fit" "element_image_fit" NOT NULL,
	"image_data_source" jsonb NOT NULL,
	"storage_file_id" bigint NOT NULL
);
--> statement-breakpoint
CREATE TABLE "number_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"text_props_id" integer NOT NULL,
	"mapping" jsonb,
	"number_data_source" jsonb NOT NULL,
	"variable_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "passwordResetTokens" (
	"email" varchar(255) PRIMARY KEY NOT NULL,
	"token" varchar(255) NOT NULL,
	"created_at" timestamp (3)
);
--> statement-breakpoint
CREATE TABLE "qr_code_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"error_correction" "qr_code_error_correction" NOT NULL,
	"foreground_color" varchar(50) NOT NULL,
	"background_color" varchar(50) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "recipient_group_item_variable_value" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_recipient_group_item_id" integer NOT NULL,
	"template_id" integer NOT NULL,
	"recipient_group_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"variable_values" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" integer PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"userId" integer,
	"ipAddress" varchar(45),
	"userAgent" text,
	"payload" text NOT NULL,
	"lastActivity" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "signed_url" (
	"id" varchar(64) PRIMARY KEY NOT NULL,
	"file_path" varchar(1024) NOT NULL,
	"content_type" varchar(255) NOT NULL,
	"file_size" bigint NOT NULL,
	"content_md5" varchar(44) NOT NULL,
	"expires_at" timestamp (3) NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	"used" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "storage_directory" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"path" varchar(1024) NOT NULL,
	"allow_uploads" boolean DEFAULT true NOT NULL,
	"allow_delete" boolean DEFAULT true NOT NULL,
	"allow_move" boolean DEFAULT true NOT NULL,
	"allow_create_sub_dirs" boolean DEFAULT true NOT NULL,
	"allow_delete_files" boolean DEFAULT true NOT NULL,
	"allow_move_files" boolean DEFAULT true NOT NULL,
	"is_protected" boolean DEFAULT false NOT NULL,
	"protect_children" boolean DEFAULT false NOT NULL,
	CONSTRAINT "storage_directory_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE "storage_file" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"path" text NOT NULL,
	"is_protected" boolean DEFAULT false NOT NULL,
	CONSTRAINT "storage_file_path_unique" UNIQUE("path")
);
--> statement-breakpoint
CREATE TABLE "student" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255),
	"phone_number" varchar(255),
	"date_of_birth" timestamp (3),
	"gender" "gender",
	"nationality" "country_code",
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "TemplateCategory" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"parent_category_id" integer,
	"order" integer NOT NULL,
	"special_type" "category_special_type",
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_config" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer NOT NULL,
	"width" integer NOT NULL,
	"height" integer NOT NULL,
	"language" "app_language" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "template_config_template_id_unique" UNIQUE("template_id")
);
--> statement-breakpoint
CREATE TABLE "template_date_variable" (
	"id" integer PRIMARY KEY NOT NULL,
	"min_date" timestamp (3),
	"max_date" timestamp (3),
	"format" varchar(50)
);
--> statement-breakpoint
CREATE TABLE "template_number_variable" (
	"id" integer PRIMARY KEY NOT NULL,
	"min_value" numeric,
	"max_value" numeric,
	"decimal_places" integer
);
--> statement-breakpoint
CREATE TABLE "template_recipient_group_item" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_recipient_group_id" integer NOT NULL,
	"student_id" integer NOT NULL,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_recipient_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"date" timestamp (3),
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template_select_variable" (
	"id" integer PRIMARY KEY NOT NULL,
	"options" json,
	"multiple" boolean
);
--> statement-breakpoint
CREATE TABLE "template_text_variable" (
	"id" integer PRIMARY KEY NOT NULL,
	"min_length" integer,
	"max_length" integer,
	"pattern" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "template_variable_base" (
	"id" serial PRIMARY KEY NOT NULL,
	"template_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"type" "template_variable_type" NOT NULL,
	"required" boolean DEFAULT false NOT NULL,
	"order" integer NOT NULL,
	"preview_value" varchar(255),
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "template" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"image_file_id" bigint,
	"category_id" integer NOT NULL,
	"order" integer NOT NULL,
	"pre_suspension_category_id" integer,
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates_config" (
	"key" "template_config_key" PRIMARY KEY NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "text_element" (
	"element_id" integer PRIMARY KEY NOT NULL,
	"text_props_id" integer NOT NULL,
	"text_data_source" jsonb NOT NULL,
	"variable_id" integer
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" integer NOT NULL,
	"role_id" integer NOT NULL,
	CONSTRAINT "user_roles_user_id_role_id_pk" PRIMARY KEY("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified_at" timestamp (3),
	"password" varchar(255) NOT NULL,
	"remember_token" varchar(100),
	"created_at" timestamp (3) NOT NULL,
	"updated_at" timestamp (3) NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "font_variant" ADD CONSTRAINT "font_variant_family_id_font_family_id_fk" FOREIGN KEY ("family_id") REFERENCES "public"."font_family"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "country_element" ADD CONSTRAINT "country_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "country_element" ADD CONSTRAINT "country_element_text_props_id_element_text_props_id_fk" FOREIGN KEY ("text_props_id") REFERENCES "public"."element_text_props"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_element" ADD CONSTRAINT "date_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_element" ADD CONSTRAINT "date_element_text_props_id_element_text_props_id_fk" FOREIGN KEY ("text_props_id") REFERENCES "public"."element_text_props"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_element" ADD CONSTRAINT "date_element_variable_id_template_variable_base_id_fk" FOREIGN KEY ("variable_id") REFERENCES "public"."template_variable_base"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "element_text_props" ADD CONSTRAINT "element_text_props_font_variant_id_font_variant_id_fk" FOREIGN KEY ("font_variant_id") REFERENCES "public"."font_variant"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gender_element" ADD CONSTRAINT "gender_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gender_element" ADD CONSTRAINT "gender_element_text_props_id_element_text_props_id_fk" FOREIGN KEY ("text_props_id") REFERENCES "public"."element_text_props"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_element" ADD CONSTRAINT "image_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "image_element" ADD CONSTRAINT "image_element_storage_file_id_storage_file_id_fk" FOREIGN KEY ("storage_file_id") REFERENCES "public"."storage_file"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_element" ADD CONSTRAINT "number_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_element" ADD CONSTRAINT "number_element_text_props_id_element_text_props_id_fk" FOREIGN KEY ("text_props_id") REFERENCES "public"."element_text_props"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "number_element" ADD CONSTRAINT "number_element_variable_id_template_variable_base_id_fk" FOREIGN KEY ("variable_id") REFERENCES "public"."template_variable_base"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "qr_code_element" ADD CONSTRAINT "qr_code_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "template_config" ADD CONSTRAINT "template_config_template_id_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."template"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_element" ADD CONSTRAINT "text_element_element_id_certificate_element_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."certificate_element"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_element" ADD CONSTRAINT "text_element_text_props_id_element_text_props_id_fk" FOREIGN KEY ("text_props_id") REFERENCES "public"."element_text_props"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "text_element" ADD CONSTRAINT "text_element_variable_id_template_variable_base_id_fk" FOREIGN KEY ("variable_id") REFERENCES "public"."template_variable_base"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cache_expires_at_idx" ON "cache" USING btree ("expires_at");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_student_template_certificate" ON "certificate" USING btree ("template_id","student_id");--> statement-breakpoint
CREATE UNIQUE INDEX "rgiv_group_item_unique" ON "recipient_group_item_variable_value" USING btree ("template_recipient_group_item_id");--> statement-breakpoint
CREATE INDEX "rgiv_student_idx" ON "recipient_group_item_variable_value" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "rgiv_template_idx" ON "recipient_group_item_variable_value" USING btree ("template_id");--> statement-breakpoint
CREATE INDEX "rgiv_recipient_group_idx" ON "recipient_group_item_variable_value" USING btree ("recipient_group_id");--> statement-breakpoint
CREATE INDEX "rgiv_variable_values_gin_idx" ON "recipient_group_item_variable_value" USING gin ("variable_values");--> statement-breakpoint
CREATE INDEX "sessions_user_id_index" ON "sessions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "sessions_last_activity_index" ON "sessions" USING btree ("lastActivity");--> statement-breakpoint
CREATE INDEX "signed_url_expires_at_idx" ON "signed_url" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "signed_url_used_expires_idx" ON "signed_url" USING btree ("used","expires_at");--> statement-breakpoint
CREATE INDEX "idx_students_name_fts" ON "student" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE INDEX "idx_students_name_trgm" ON "student" USING gist ("name" gist_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "template_category_special_type_key" ON "TemplateCategory" USING btree ("special_type");--> statement-breakpoint
CREATE INDEX "idx_template_categories_name_fts" ON "TemplateCategory" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE INDEX "idx_template_categories_name_trgm" ON "TemplateCategory" USING gist ("name" gist_trgm_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "trgi_student_group_unique" ON "template_recipient_group_item" USING btree ("student_id","template_recipient_group_id");--> statement-breakpoint
CREATE UNIQUE INDEX "template_base_variable_template_id_name_key" ON "template_variable_base" USING btree ("template_id","name");--> statement-breakpoint
CREATE INDEX "idx_templates_name_fts" ON "template" USING gin (to_tsvector('simple', "name"));--> statement-breakpoint
CREATE INDEX "idx_templates_name_trgm" ON "template" USING gist ("name" gist_trgm_ops);