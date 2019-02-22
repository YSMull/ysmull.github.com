if (typeof kotlin === 'undefined') {
  throw new Error("Error loading module 'chkrConverter'. Its dependency 'kotlin' was not found. Please, check whether 'kotlin' is loaded prior to 'chkrConverter'.");
}
var chkrConverter = function (_, Kotlin) {
  'use strict';
  var toList = Kotlin.kotlin.collections.toList_abgq59$;
  var joinToString = Kotlin.kotlin.collections.joinToString_fmv235$;
  var Error_init = Kotlin.kotlin.Error_init_pdl1vj$;
  var Regex_init = Kotlin.kotlin.text.Regex_init_61zpoe$;
  var Kind_CLASS = Kotlin.Kind.CLASS;
  var CharRange = Kotlin.kotlin.ranges.CharRange;
  var toBoxedChar = Kotlin.toBoxedChar;
  var contains = Kotlin.kotlin.text.contains_li3zpu$;
  var StringBuilder_init = Kotlin.kotlin.text.StringBuilder_init;
  var equals = Kotlin.equals;
  var unboxChar = Kotlin.unboxChar;
  var LinkedHashMap_init = Kotlin.kotlin.collections.LinkedHashMap_init_q3lmfv$;
  var ArrayList_init = Kotlin.kotlin.collections.ArrayList_init_287e2$;
  var Kind_INTERFACE = Kotlin.Kind.INTERFACE;
  var toChar = Kotlin.toChar;
  var Kind_OBJECT = Kotlin.Kind.OBJECT;
  var Enum = Kotlin.kotlin.Enum;
  var throwISE = Kotlin.throwISE;
  ChkrLexer.prototype = Object.create(Lexer.prototype);
  ChkrLexer.prototype.constructor = ChkrLexer;
  ChkrParser.prototype = Object.create(Parser.prototype);
  ChkrParser.prototype.constructor = ChkrParser;
  ChkrTree$Value.prototype = Object.create(ChkrTree.prototype);
  ChkrTree$Value.prototype.constructor = ChkrTree$Value;
  ChkrTree$Obj.prototype = Object.create(ChkrTree.prototype);
  ChkrTree$Obj.prototype.constructor = ChkrTree$Obj;
  ChkrTree$Arr.prototype = Object.create(ChkrTree.prototype);
  ChkrTree$Arr.prototype.constructor = ChkrTree$Arr;
  ChkrTree$Basic.prototype = Object.create(ChkrTree.prototype);
  ChkrTree$Basic.prototype.constructor = ChkrTree$Basic;
  ChkrTree$Mixin.prototype = Object.create(ChkrTree.prototype);
  ChkrTree$Mixin.prototype.constructor = ChkrTree$Mixin;
  ChkrTree$Or.prototype = Object.create(ChkrTree.prototype);
  ChkrTree$Or.prototype.constructor = ChkrTree$Or;
  ChkrTree$OrVal.prototype = Object.create(ChkrTree.prototype);
  ChkrTree$OrVal.prototype.constructor = ChkrTree$OrVal;
  TokenType.prototype = Object.create(Enum.prototype);
  TokenType.prototype.constructor = TokenType;
  function convert(str) {
    var lexer = new ChkrLexer(str);
    var parser = new ChkrParser(lexer);
    var res = parser.value();
    var ast = new AstPrinter();
    var out = ast.print_aii4wp$(res);
    return out;
  }
  function AstPrinter() {
  }
  AstPrinter.prototype.print_aii4wp$ = function (chkrTree) {
    return chkrTree.accept_7wgggr$(this);
  };
  AstPrinter.prototype.visitValueChkr_xvb3p8$ = function (value) {
    return value.token.text;
  };
  function AstPrinter$visitObjChkr$lambda(this$AstPrinter) {
    return function (f) {
      var key = f.component1()
      , value = f.component2();
      return "'" + key + "': " + this$AstPrinter.print_aii4wp$(value);
    };
  }
  AstPrinter.prototype.visitObjChkr_ukcbwe$ = function (tree) {
    var items = joinToString(toList(tree.objChkr), ',\n', void 0, void 0, void 0, void 0, AstPrinter$visitObjChkr$lambda(this));
    return 'c.Obj({' + '\n' + items + '\n' + '})';
  };
  AstPrinter.prototype.visitArrChkr_ukclw4$ = function (arr) {
    return 'c.Arr(' + this.print_aii4wp$(arr.arrChkr) + ')';
  };
  AstPrinter.prototype.visitBasicChkr_xkbcqh$ = function (basic) {
    var tmp$;
    switch (basic.token.text) {
      case 'Num':
        tmp$ = 't.Num';
        break;
      case 'Str':
        tmp$ = 't.Str';
        break;
      case 'Bool':
        tmp$ = 't.Bool';
        break;
      default:throw Error_init('unknown basic token ' + basic.token.text);
    }
    return tmp$;
  };
  function AstPrinter$visitMixinChkr$lambda(this$AstPrinter) {
    return function (v) {
      return this$AstPrinter.print_aii4wp$(v);
    };
  }
  AstPrinter.prototype.visitMixinChkr_xqiavg$ = function (mixin) {
    var itms = joinToString(mixin.arguments, ',\n', void 0, void 0, void 0, void 0, AstPrinter$visitMixinChkr$lambda(this));
    return 'c.Extend(' + '\n' + itms + '\n' + ')';
  };
  function AstPrinter$visitOrChkr$lambda(this$AstPrinter) {
    return function (v) {
      return this$AstPrinter.print_aii4wp$(v);
    };
  }
  AstPrinter.prototype.visitOrChkr_nwdbgo$ = function (or) {
    var items = joinToString(or.arguments, ',\n', void 0, void 0, void 0, void 0, AstPrinter$visitOrChkr$lambda(this));
    return 'c.Or(' + '\n' + items + '\n' + ')';
  };
  function AstPrinter$visitOrValChkr$lambda(v) {
    var $receiver = v.token.text;
    return Regex_init('(^"|"$)').replace_x2uqeu$($receiver, "'");
  }
  AstPrinter.prototype.visitOrValChkr_xrqxjd$ = function (orVal) {
    var orValItems = joinToString(orVal.arguments, ',', void 0, void 0, void 0, void 0, AstPrinter$visitOrValChkr$lambda);
    return 'c.OrVal(' + orValItems + ')';
  };
  AstPrinter.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'AstPrinter',
    interfaces: [ChkrTree$Visitor]
  };
  function ChkrLexer(input) {
    Lexer.call(this, input);
  }
  ChkrLexer.prototype.isDIGIT_0 = function () {
    return (new CharRange(48, 57)).contains_mef7kx$(this.c_8be2vx$);
  };
  ChkrLexer.prototype.isLETTER_0 = function () {
    return (new CharRange(97, 122)).contains_mef7kx$(this.c_8be2vx$) || (new CharRange(65, 90)).contains_mef7kx$(this.c_8be2vx$) || (new CharRange(48, 57)).contains_mef7kx$(this.c_8be2vx$) || contains("=+-_)(*&^%$#@!~`';.:,<>/?] [{}\\|", String.fromCharCode(this.c_8be2vx$));
  };
  ChkrLexer.prototype.NUMBER_0 = function () {
    var flag = 1;
    if (this.c_8be2vx$ === 45) {
      this.consume();
      flag = -1;
    }
    var n = 0.0;
    do {
      n *= 10.0;
      n += this.c_8be2vx$ - 48;
      this.DIGIT_0();
    }
     while (this.isDIGIT_0());
    var m = 0.0;
    if (this.c_8be2vx$ === 46) {
      this.consume();
      var k = 1;
      while (this.isDIGIT_0()) {
        m *= 10.0;
        m += this.c_8be2vx$ - 48;
        k = k * 10 | 0;
        this.DIGIT_0();
      }
      m /= k;
    }
    n += m;
    n *= flag;
    return new Token(TokenType$NUMBER_getInstance(), n.toString());
  };
  ChkrLexer.prototype.STRING_0 = function () {
    var buf = StringBuilder_init();
    this.consume();
    buf.append_gw00v9$('"');
    do {
      buf.append_s8itvh$(this.c_8be2vx$);
      this.LETTER_0();
    }
     while (this.isLETTER_0());
    this.consume();
    buf.append_gw00v9$('"');
    return new Token(TokenType$STRING_getInstance(), buf.toString());
  };
  ChkrLexer.prototype.TRUE_0 = function () {
    var $receiver = this.input_8be2vx$;
    var startIndex = this.p_8be2vx$;
    var endIndex = this.p_8be2vx$ + 4 | 0;
    var expectTRUE = $receiver.substring(startIndex, endIndex);
    if (equals(expectTRUE, 'true')) {
      this.consumeN_za3lpa$(4);
      return new Token(TokenType$TRUE_getInstance(), 'true');
    }
     else {
      throw Error_init('"' + '[pos]:' + this.p_8be2vx$ + ',expecting true, found ' + expectTRUE);
    }
  };
  ChkrLexer.prototype.FALSE_0 = function () {
    var $receiver = this.input_8be2vx$;
    var startIndex = this.p_8be2vx$;
    var endIndex = this.p_8be2vx$ + 5 | 0;
    var expectFALSE = $receiver.substring(startIndex, endIndex);
    if (equals(expectFALSE, 'false')) {
      this.consumeN_za3lpa$(5);
      return new Token(TokenType$FALSE_getInstance(), 'false');
    }
     else {
      throw Error_init('"' + '[pos]:' + this.p_8be2vx$ + ',expecting false ,found ' + expectFALSE);
    }
  };
  ChkrLexer.prototype.CHKR_0 = function (token) {
    var tokenLen = token.text.length;
    var $receiver = this.input_8be2vx$;
    var startIndex = this.p_8be2vx$;
    var endIndex = this.p_8be2vx$ + tokenLen | 0;
    var inputToken = $receiver.substring(startIndex, endIndex);
    if (equals(inputToken, token.text)) {
      this.consumeN_za3lpa$(tokenLen);
      return token;
    }
     else {
      throw Error_init('[pos]:' + this.p_8be2vx$ + ',expecting ' + token.text + ', found ' + inputToken);
    }
  };
  ChkrLexer.prototype.DIGIT_0 = function () {
    if (this.isDIGIT_0())
      this.consume();
    else
      throw Error_init('"' + '[pos]:' + this.p_8be2vx$ + ',expecting DIGIT; found ' + String.fromCharCode(this.c_8be2vx$));
  };
  ChkrLexer.prototype.LETTER_0 = function () {
    if (this.isLETTER_0())
      this.consume();
    else
      throw Error_init('"' + '[pos]:' + this.p_8be2vx$ + ',expecting LETTER; found ' + String.fromCharCode(this.c_8be2vx$));
  };
  ChkrLexer.prototype.WS_0 = function () {
    while (this.c_8be2vx$ === 32 || this.c_8be2vx$ === 9 || this.c_8be2vx$ === 10 || this.c_8be2vx$ === 13)
      this.consume();
  };
  ChkrLexer.prototype.getTokenName_2mz4ga$ = function (token) {
    return token.toString();
  };
  ChkrLexer.prototype.nextToken = function () {
    while (this.c_8be2vx$ !== unboxChar(Lexer$Companion_getInstance().EOF)) {
      switch (this.c_8be2vx$) {
        case 32:
        case 9:
        case 10:
        case 13:
          this.WS_0();
          break;
        case 44:
          this.consume();
          return new Token(TokenType$COMMA_getInstance(), ',');
        case 91:
          this.consume();
          return new Token(TokenType$LEFT_BRACKET_getInstance(), '[');
        case 93:
          this.consume();
          return new Token(TokenType$RIGHT_BRACKET_getInstance(), ']');
        case 58:
          this.consume();
          return new Token(TokenType$COLON_getInstance(), ':');
        case 123:
          this.consume();
          return new Token(TokenType$LEFT_BRACE_getInstance(), '{');
        case 125:
          this.consume();
          return new Token(TokenType$RIGHT_BRACE_getInstance(), '}');
        case 40:
          this.consume();
          return new Token(TokenType$LEFT_PAREN_getInstance(), '(');
        case 41:
          this.consume();
          return new Token(TokenType$RIGHT_PAREN_getInstance(), ')');
        case 34:
          return this.STRING_0();
        case 116:
          return this.TRUE_0();
        case 102:
          return this.FALSE_0();
        case 45:
          return this.NUMBER_0();
        case 78:
          return this.CHKR_0(new Token(TokenType$NUM_C_getInstance(), 'Num'));
        case 83:
          return this.CHKR_0(new Token(TokenType$STR_C_getInstance(), 'Str'));
        case 79:
          return this.input_8be2vx$.charCodeAt(this.p_8be2vx$ + 2 | 0) === 86 ? this.CHKR_0(new Token(TokenType$OR_VAL_C_getInstance(), 'OrVal')) : this.CHKR_0(new Token(TokenType$OR_C_getInstance(), 'Or'));
        case 77:
          return this.CHKR_0(new Token(TokenType$MIXIN_C_getInstance(), 'Mixin'));
        case 66:
          return this.CHKR_0(new Token(TokenType$BOOL_C_getInstance(), 'Bool'));
        default:if (this.isDIGIT_0())
            return this.NUMBER_0();
          throw Error_init('[pos]:' + this.p_8be2vx$ + ',invalid character: ' + String.fromCharCode(this.c_8be2vx$));
      }
    }
    return new Token(TokenType$EOF_getInstance(), 'EOF');
  };
  ChkrLexer.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'ChkrLexer',
    interfaces: [Lexer]
  };
  function ChkrParser(input) {
    Parser.call(this, input);
  }
  ChkrParser.prototype.value = function () {
    var tmp$;
    switch (this.lookahead_8be2vx$.type.name) {
      case 'LEFT_BRACE':
        tmp$ = this.obj_0();
        break;
      case 'LEFT_BRACKET':
        tmp$ = this.arr_0();
        break;
      case 'NUM_C':
      case 'STR_C':
      case 'BOOL_C':
        var target = this.lookahead_8be2vx$;
        this.match_o9lirj$(this.lookahead_8be2vx$.type);
        tmp$ = new ChkrTree$Basic(target);
        break;
      case 'MIXIN_C':
      case 'OR_C':
        tmp$ = this.listOfChkr_0(this.lookahead_8be2vx$);
        break;
      case 'OR_VAL_C':
        tmp$ = this.orVal_0();
        break;
      default:throw Error_init('[pos]:' + this.input_8be2vx$.p_8be2vx$ + ', unexpect token:' + this.lookahead_8be2vx$.type);
    }
    return tmp$;
  };
  ChkrParser.prototype.obj_0 = function () {
    var objToken = this.lookahead_8be2vx$;
    this.match_o9lirj$(TokenType$LEFT_BRACE_getInstance());
    var done = false;
    var params = LinkedHashMap_init();
    do {
      if (this.lookahead_8be2vx$.type === TokenType$STRING_getInstance()) {
        var $receiver = this.lookahead_8be2vx$.text;
        var key = Regex_init('(^"|"$)').replace_x2uqeu$($receiver, '');
        this.match_o9lirj$(TokenType$STRING_getInstance());
        this.match_o9lirj$(TokenType$COLON_getInstance());
        var value = this.value();
        params.put_xwzc9p$(key, value);
      }
      if (this.lookahead_8be2vx$.type === TokenType$COMMA_getInstance()) {
        this.consume_8be2vx$();
      }
       else {
        done = true;
      }
    }
     while (!done);
    this.match_o9lirj$(TokenType$RIGHT_BRACE_getInstance());
    return new ChkrTree$Obj(objToken, params);
  };
  ChkrParser.prototype.listOfChkr_0 = function (token) {
    var tmp$;
    this.match_o9lirj$(this.lookahead_8be2vx$.type);
    this.match_o9lirj$(TokenType$LEFT_PAREN_getInstance());
    var done = false;
    var params = ArrayList_init();
    do {
      params.add_11rb$(this.value());
      if (this.lookahead_8be2vx$.type === TokenType$COMMA_getInstance()) {
        this.consume_8be2vx$();
      }
       else {
        done = true;
      }
    }
     while (!done);
    this.match_o9lirj$(TokenType$RIGHT_PAREN_getInstance());
    switch (token.type.name) {
      case 'OR_C':
        tmp$ = new ChkrTree$Or(token, params);
        break;
      case 'MIXIN_C':
        tmp$ = new ChkrTree$Mixin(token, params);
        break;
      default:throw Error_init('expect OR_C, MIXIN_C');
    }
    return tmp$;
  };
  ChkrParser.prototype.arr_0 = function () {
    var arrToken = this.lookahead_8be2vx$;
    this.match_o9lirj$(TokenType$LEFT_BRACKET_getInstance());
    var arrType = this.value();
    this.match_o9lirj$(TokenType$RIGHT_BRACKET_getInstance());
    return new ChkrTree$Arr(arrToken, arrType);
  };
  ChkrParser.prototype.orVal_0 = function () {
    var orValToken = this.lookahead_8be2vx$;
    this.match_o9lirj$(TokenType$OR_VAL_C_getInstance());
    this.match_o9lirj$(TokenType$LEFT_PAREN_getInstance());
    var done = false;
    var params = ArrayList_init();
    do {
      switch (this.lookahead_8be2vx$.type.name) {
        case 'STRING':
        case 'NUMBER':
        case 'TRUE':
        case 'FALSE':
          var valueToken = new ChkrTree$Value(this.lookahead_8be2vx$);
          params.add_11rb$(valueToken);
          break;
        default:throw Error_init('expect STRING, NUMBER, TRUE, FALSE');
      }
      this.match_o9lirj$(this.lookahead_8be2vx$.type);
      if (this.lookahead_8be2vx$.type === TokenType$COMMA_getInstance()) {
        this.consume_8be2vx$();
      }
       else {
        done = true;
      }
    }
     while (!done);
    this.match_o9lirj$(TokenType$RIGHT_PAREN_getInstance());
    return new ChkrTree$OrVal(orValToken, params);
  };
  ChkrParser.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'ChkrParser',
    interfaces: [Parser]
  };
  function ChkrTree() {
  }
  function ChkrTree$Visitor() {
  }
  ChkrTree$Visitor.$metadata$ = {
    kind: Kind_INTERFACE,
    simpleName: 'Visitor',
    interfaces: []
  };
  function ChkrTree$Value(token) {
    ChkrTree.call(this);
    this.token = token;
  }
  ChkrTree$Value.prototype.accept_7wgggr$ = function (visitor) {
    return visitor.visitValueChkr_xvb3p8$(this);
  };
  ChkrTree$Value.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Value',
    interfaces: [ChkrTree]
  };
  function ChkrTree$Obj(token, objChkr) {
    ChkrTree.call(this);
    this.token = token;
    this.objChkr = objChkr;
  }
  ChkrTree$Obj.prototype.accept_7wgggr$ = function (visitor) {
    return visitor.visitObjChkr_ukcbwe$(this);
  };
  ChkrTree$Obj.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Obj',
    interfaces: [ChkrTree]
  };
  function ChkrTree$Arr(token, arrChkr) {
    ChkrTree.call(this);
    this.token = token;
    this.arrChkr = arrChkr;
  }
  ChkrTree$Arr.prototype.accept_7wgggr$ = function (visitor) {
    return visitor.visitArrChkr_ukclw4$(this);
  };
  ChkrTree$Arr.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Arr',
    interfaces: [ChkrTree]
  };
  function ChkrTree$Basic(token) {
    ChkrTree.call(this);
    this.token = token;
  }
  ChkrTree$Basic.prototype.accept_7wgggr$ = function (visitor) {
    return visitor.visitBasicChkr_xkbcqh$(this);
  };
  ChkrTree$Basic.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Basic',
    interfaces: [ChkrTree]
  };
  function ChkrTree$Mixin(token, arguments_0) {
    ChkrTree.call(this);
    this.token = token;
    this.arguments = arguments_0;
  }
  ChkrTree$Mixin.prototype.accept_7wgggr$ = function (visitor) {
    return visitor.visitMixinChkr_xqiavg$(this);
  };
  ChkrTree$Mixin.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Mixin',
    interfaces: [ChkrTree]
  };
  function ChkrTree$Or(token, arguments_0) {
    ChkrTree.call(this);
    this.token = token;
    this.arguments = arguments_0;
  }
  ChkrTree$Or.prototype.accept_7wgggr$ = function (visitor) {
    return visitor.visitOrChkr_nwdbgo$(this);
  };
  ChkrTree$Or.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Or',
    interfaces: [ChkrTree]
  };
  function ChkrTree$OrVal(token, arguments_0) {
    ChkrTree.call(this);
    this.token = token;
    this.arguments = arguments_0;
  }
  ChkrTree$OrVal.prototype.accept_7wgggr$ = function (visitor) {
    return visitor.visitOrValChkr_xrqxjd$(this);
  };
  ChkrTree$OrVal.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'OrVal',
    interfaces: [ChkrTree]
  };
  ChkrTree.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'ChkrTree',
    interfaces: []
  };
  function Lexer(input) {
    Lexer$Companion_getInstance();
    this.input_8be2vx$ = input;
    this.p_8be2vx$ = 0;
    this.c_8be2vx$ = null;
    this.c_8be2vx$ = this.input_8be2vx$.charCodeAt(this.p_8be2vx$);
  }
  function Lexer$Companion() {
    Lexer$Companion_instance = this;
    this.EOF = toBoxedChar(toChar(-1));
  }
  Lexer$Companion.$metadata$ = {
    kind: Kind_OBJECT,
    simpleName: 'Companion',
    interfaces: []
  };
  var Lexer$Companion_instance = null;
  function Lexer$Companion_getInstance() {
    if (Lexer$Companion_instance === null) {
      new Lexer$Companion();
    }
    return Lexer$Companion_instance;
  }
  Lexer.prototype.consume = function () {
    this.p_8be2vx$ = this.p_8be2vx$ + 1 | 0;
    this.c_8be2vx$ = this.p_8be2vx$ >= this.input_8be2vx$.length ? unboxChar(Lexer$Companion_getInstance().EOF) : this.input_8be2vx$.charCodeAt(this.p_8be2vx$);
  };
  Lexer.prototype.consumeN_za3lpa$ = function (n) {
    this.p_8be2vx$ = this.p_8be2vx$ + n | 0;
    this.c_8be2vx$ = this.p_8be2vx$ >= this.input_8be2vx$.length ? unboxChar(Lexer$Companion_getInstance().EOF) : this.input_8be2vx$.charCodeAt(this.p_8be2vx$);
  };
  Lexer.prototype.match_s8itvh$ = function (x) {
    if (this.c_8be2vx$ === x)
      this.consume();
    else
      throw Error_init('[pos]:' + this.p_8be2vx$ + ',expecting ' + String.fromCharCode(x) + '; found ' + String.fromCharCode(this.c_8be2vx$));
  };
  Lexer.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Lexer',
    interfaces: []
  };
  function Parser(input) {
    this.input_8be2vx$ = input;
    this.lookahead_8be2vx$ = this.input_8be2vx$.nextToken();
  }
  Parser.prototype.match_o9lirj$ = function (x) {
    if (this.lookahead_8be2vx$.type === x)
      this.consume_8be2vx$();
    else
      throw Error_init('[pos]:' + this.input_8be2vx$.p_8be2vx$ + ',expecting ' + x.name + '; found ' + this.lookahead_8be2vx$.text);
  };
  Parser.prototype.consume_8be2vx$ = function () {
    this.lookahead_8be2vx$ = this.input_8be2vx$.nextToken();
  };
  Parser.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Parser',
    interfaces: []
  };
  function Token(type, text) {
    this.type = type;
    this.text = text;
  }
  Token.prototype.toString = function () {
    return '<' + this.type.name + ', ' + this.text + '>';
  };
  Token.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'Token',
    interfaces: []
  };
  function TokenType(name, ordinal) {
    Enum.call(this);
    this.name$ = name;
    this.ordinal$ = ordinal;
  }
  function TokenType_initFields() {
    TokenType_initFields = function () {
    };
    TokenType$EOF_instance = new TokenType('EOF', 0);
    TokenType$LEFT_PAREN_instance = new TokenType('LEFT_PAREN', 1);
    TokenType$RIGHT_PAREN_instance = new TokenType('RIGHT_PAREN', 2);
    TokenType$LEFT_BRACE_instance = new TokenType('LEFT_BRACE', 3);
    TokenType$RIGHT_BRACE_instance = new TokenType('RIGHT_BRACE', 4);
    TokenType$LEFT_BRACKET_instance = new TokenType('LEFT_BRACKET', 5);
    TokenType$RIGHT_BRACKET_instance = new TokenType('RIGHT_BRACKET', 6);
    TokenType$COMMA_instance = new TokenType('COMMA', 7);
    TokenType$COLON_instance = new TokenType('COLON', 8);
    TokenType$STRING_instance = new TokenType('STRING', 9);
    TokenType$NUMBER_instance = new TokenType('NUMBER', 10);
    TokenType$TRUE_instance = new TokenType('TRUE', 11);
    TokenType$FALSE_instance = new TokenType('FALSE', 12);
    TokenType$NUM_C_instance = new TokenType('NUM_C', 13);
    TokenType$STR_C_instance = new TokenType('STR_C', 14);
    TokenType$BOOL_C_instance = new TokenType('BOOL_C', 15);
    TokenType$MIXIN_C_instance = new TokenType('MIXIN_C', 16);
    TokenType$OR_C_instance = new TokenType('OR_C', 17);
    TokenType$OR_VAL_C_instance = new TokenType('OR_VAL_C', 18);
  }
  var TokenType$EOF_instance;
  function TokenType$EOF_getInstance() {
    TokenType_initFields();
    return TokenType$EOF_instance;
  }
  var TokenType$LEFT_PAREN_instance;
  function TokenType$LEFT_PAREN_getInstance() {
    TokenType_initFields();
    return TokenType$LEFT_PAREN_instance;
  }
  var TokenType$RIGHT_PAREN_instance;
  function TokenType$RIGHT_PAREN_getInstance() {
    TokenType_initFields();
    return TokenType$RIGHT_PAREN_instance;
  }
  var TokenType$LEFT_BRACE_instance;
  function TokenType$LEFT_BRACE_getInstance() {
    TokenType_initFields();
    return TokenType$LEFT_BRACE_instance;
  }
  var TokenType$RIGHT_BRACE_instance;
  function TokenType$RIGHT_BRACE_getInstance() {
    TokenType_initFields();
    return TokenType$RIGHT_BRACE_instance;
  }
  var TokenType$LEFT_BRACKET_instance;
  function TokenType$LEFT_BRACKET_getInstance() {
    TokenType_initFields();
    return TokenType$LEFT_BRACKET_instance;
  }
  var TokenType$RIGHT_BRACKET_instance;
  function TokenType$RIGHT_BRACKET_getInstance() {
    TokenType_initFields();
    return TokenType$RIGHT_BRACKET_instance;
  }
  var TokenType$COMMA_instance;
  function TokenType$COMMA_getInstance() {
    TokenType_initFields();
    return TokenType$COMMA_instance;
  }
  var TokenType$COLON_instance;
  function TokenType$COLON_getInstance() {
    TokenType_initFields();
    return TokenType$COLON_instance;
  }
  var TokenType$STRING_instance;
  function TokenType$STRING_getInstance() {
    TokenType_initFields();
    return TokenType$STRING_instance;
  }
  var TokenType$NUMBER_instance;
  function TokenType$NUMBER_getInstance() {
    TokenType_initFields();
    return TokenType$NUMBER_instance;
  }
  var TokenType$TRUE_instance;
  function TokenType$TRUE_getInstance() {
    TokenType_initFields();
    return TokenType$TRUE_instance;
  }
  var TokenType$FALSE_instance;
  function TokenType$FALSE_getInstance() {
    TokenType_initFields();
    return TokenType$FALSE_instance;
  }
  var TokenType$NUM_C_instance;
  function TokenType$NUM_C_getInstance() {
    TokenType_initFields();
    return TokenType$NUM_C_instance;
  }
  var TokenType$STR_C_instance;
  function TokenType$STR_C_getInstance() {
    TokenType_initFields();
    return TokenType$STR_C_instance;
  }
  var TokenType$BOOL_C_instance;
  function TokenType$BOOL_C_getInstance() {
    TokenType_initFields();
    return TokenType$BOOL_C_instance;
  }
  var TokenType$MIXIN_C_instance;
  function TokenType$MIXIN_C_getInstance() {
    TokenType_initFields();
    return TokenType$MIXIN_C_instance;
  }
  var TokenType$OR_C_instance;
  function TokenType$OR_C_getInstance() {
    TokenType_initFields();
    return TokenType$OR_C_instance;
  }
  var TokenType$OR_VAL_C_instance;
  function TokenType$OR_VAL_C_getInstance() {
    TokenType_initFields();
    return TokenType$OR_VAL_C_instance;
  }
  TokenType.$metadata$ = {
    kind: Kind_CLASS,
    simpleName: 'TokenType',
    interfaces: [Enum]
  };
  function TokenType$values() {
    return [TokenType$EOF_getInstance(), TokenType$LEFT_PAREN_getInstance(), TokenType$RIGHT_PAREN_getInstance(), TokenType$LEFT_BRACE_getInstance(), TokenType$RIGHT_BRACE_getInstance(), TokenType$LEFT_BRACKET_getInstance(), TokenType$RIGHT_BRACKET_getInstance(), TokenType$COMMA_getInstance(), TokenType$COLON_getInstance(), TokenType$STRING_getInstance(), TokenType$NUMBER_getInstance(), TokenType$TRUE_getInstance(), TokenType$FALSE_getInstance(), TokenType$NUM_C_getInstance(), TokenType$STR_C_getInstance(), TokenType$BOOL_C_getInstance(), TokenType$MIXIN_C_getInstance(), TokenType$OR_C_getInstance(), TokenType$OR_VAL_C_getInstance()];
  }
  TokenType.values = TokenType$values;
  function TokenType$valueOf(name) {
    switch (name) {
      case 'EOF':
        return TokenType$EOF_getInstance();
      case 'LEFT_PAREN':
        return TokenType$LEFT_PAREN_getInstance();
      case 'RIGHT_PAREN':
        return TokenType$RIGHT_PAREN_getInstance();
      case 'LEFT_BRACE':
        return TokenType$LEFT_BRACE_getInstance();
      case 'RIGHT_BRACE':
        return TokenType$RIGHT_BRACE_getInstance();
      case 'LEFT_BRACKET':
        return TokenType$LEFT_BRACKET_getInstance();
      case 'RIGHT_BRACKET':
        return TokenType$RIGHT_BRACKET_getInstance();
      case 'COMMA':
        return TokenType$COMMA_getInstance();
      case 'COLON':
        return TokenType$COLON_getInstance();
      case 'STRING':
        return TokenType$STRING_getInstance();
      case 'NUMBER':
        return TokenType$NUMBER_getInstance();
      case 'TRUE':
        return TokenType$TRUE_getInstance();
      case 'FALSE':
        return TokenType$FALSE_getInstance();
      case 'NUM_C':
        return TokenType$NUM_C_getInstance();
      case 'STR_C':
        return TokenType$STR_C_getInstance();
      case 'BOOL_C':
        return TokenType$BOOL_C_getInstance();
      case 'MIXIN_C':
        return TokenType$MIXIN_C_getInstance();
      case 'OR_C':
        return TokenType$OR_C_getInstance();
      case 'OR_VAL_C':
        return TokenType$OR_VAL_C_getInstance();
      default:throwISE('No enum constant parser.TokenType.' + name);
    }
  }
  TokenType.valueOf_61zpoe$ = TokenType$valueOf;
  _.convert = convert;
  var package$parser = _.parser || (_.parser = {});
  package$parser.AstPrinter = AstPrinter;
  package$parser.ChkrLexer = ChkrLexer;
  package$parser.ChkrParser = ChkrParser;
  ChkrTree.Visitor = ChkrTree$Visitor;
  ChkrTree.Value = ChkrTree$Value;
  ChkrTree.Obj = ChkrTree$Obj;
  ChkrTree.Arr = ChkrTree$Arr;
  ChkrTree.Basic = ChkrTree$Basic;
  ChkrTree.Mixin = ChkrTree$Mixin;
  ChkrTree.Or = ChkrTree$Or;
  ChkrTree.OrVal = ChkrTree$OrVal;
  package$parser.ChkrTree = ChkrTree;
  Object.defineProperty(Lexer, 'Companion', {
    get: Lexer$Companion_getInstance
  });
  package$parser.Lexer = Lexer;
  package$parser.Parser = Parser;
  package$parser.Token = Token;
  Object.defineProperty(TokenType, 'EOF', {
    get: TokenType$EOF_getInstance
  });
  Object.defineProperty(TokenType, 'LEFT_PAREN', {
    get: TokenType$LEFT_PAREN_getInstance
  });
  Object.defineProperty(TokenType, 'RIGHT_PAREN', {
    get: TokenType$RIGHT_PAREN_getInstance
  });
  Object.defineProperty(TokenType, 'LEFT_BRACE', {
    get: TokenType$LEFT_BRACE_getInstance
  });
  Object.defineProperty(TokenType, 'RIGHT_BRACE', {
    get: TokenType$RIGHT_BRACE_getInstance
  });
  Object.defineProperty(TokenType, 'LEFT_BRACKET', {
    get: TokenType$LEFT_BRACKET_getInstance
  });
  Object.defineProperty(TokenType, 'RIGHT_BRACKET', {
    get: TokenType$RIGHT_BRACKET_getInstance
  });
  Object.defineProperty(TokenType, 'COMMA', {
    get: TokenType$COMMA_getInstance
  });
  Object.defineProperty(TokenType, 'COLON', {
    get: TokenType$COLON_getInstance
  });
  Object.defineProperty(TokenType, 'STRING', {
    get: TokenType$STRING_getInstance
  });
  Object.defineProperty(TokenType, 'NUMBER', {
    get: TokenType$NUMBER_getInstance
  });
  Object.defineProperty(TokenType, 'TRUE', {
    get: TokenType$TRUE_getInstance
  });
  Object.defineProperty(TokenType, 'FALSE', {
    get: TokenType$FALSE_getInstance
  });
  Object.defineProperty(TokenType, 'NUM_C', {
    get: TokenType$NUM_C_getInstance
  });
  Object.defineProperty(TokenType, 'STR_C', {
    get: TokenType$STR_C_getInstance
  });
  Object.defineProperty(TokenType, 'BOOL_C', {
    get: TokenType$BOOL_C_getInstance
  });
  Object.defineProperty(TokenType, 'MIXIN_C', {
    get: TokenType$MIXIN_C_getInstance
  });
  Object.defineProperty(TokenType, 'OR_C', {
    get: TokenType$OR_C_getInstance
  });
  Object.defineProperty(TokenType, 'OR_VAL_C', {
    get: TokenType$OR_VAL_C_getInstance
  });
  package$parser.TokenType = TokenType;
  Kotlin.defineModule('chkrConverter', _);
  return _;
}(typeof chkrConverter === 'undefined' ? {} : chkrConverter, kotlin);
