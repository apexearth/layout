<a name="module_@apexearth/layout"></a>

## @apexearth/layout
## Install
```
npm install @apexearth/layout
```

## Usage
```javascript
const Layout = require('@apexearth/layout')
```

<a name="Layout"></a>

## Layout
Class used to create layouts.

**Kind**: global class  

* [Layout](#Layout)
    * [new Layout(autoShrink, overlap)](#new_Layout_new)
    * [.bounds](#Layout+bounds) : <code>Object</code>
    * [.size](#Layout+size) : <code>number</code>
    * [.sections](#Layout+sections) : <code>Array</code>
    * [.width](#Layout+width) ⇒ <code>number</code>
    * [.height](#Layout+height) ⇒ <code>number</code>
    * [.addSection(left, top, right, bottom, name, data, corner)](#Layout+addSection) ⇒ <code>Section</code>
    * [.deleteAllSections()](#Layout+deleteAllSections)
    * [.deleteSections(x, y)](#Layout+deleteSections)
    * [.deleteSection(section)](#Layout+deleteSection) ⇒ <code>Section</code>
    * [.removeSection(section)](#Layout+removeSection) ⇒ <code>Section</code>
    * [.toString()](#Layout+toString) ⇒ <code>string</code>
    * [.add(left, top, right, bottom, x, y, width, height, corner, name, data)](#Layout+add) ⇒ <code>Section</code>

<a name="new_Layout_new"></a>

### new Layout(autoShrink, overlap)

| Param | Description |
| --- | --- |
| autoShrink | Whether to automatically shrink the Layout bounds when possible. |
| overlap | Whether to allow Sections to overlap each other. |

<a name="Layout+bounds"></a>

### layout.bounds : <code>Object</code>
The bounds of the Layout.

**Kind**: instance property of [<code>Layout</code>](#Layout)  
<a name="Layout+size"></a>

### layout.size : <code>number</code>
The total area of the Layout. (width * height)

**Kind**: instance property of [<code>Layout</code>](#Layout)  
<a name="Layout+sections"></a>

### layout.sections : <code>Array</code>
The sections within the Layout.

**Kind**: instance property of [<code>Layout</code>](#Layout)  
<a name="Layout+width"></a>

### layout.width ⇒ <code>number</code>
The width of the Layout.

**Kind**: instance property of [<code>Layout</code>](#Layout)  
<a name="Layout+height"></a>

### layout.height ⇒ <code>number</code>
The height of the Layout.

**Kind**: instance property of [<code>Layout</code>](#Layout)  
<a name="Layout+addSection"></a>

### layout.addSection(left, top, right, bottom, name, data, corner) ⇒ <code>Section</code>
Add a section to the Layout.

**Kind**: instance method of [<code>Layout</code>](#Layout)  

| Param | Type | Description |
| --- | --- | --- |
| left | <code>number</code> | The left bound. |
| top | <code>number</code> | The top bound. |
| right | <code>number</code> | The right bound. |
| bottom | <code>number</code> | The bottom bound. |
| name | <code>string</code> | The name of the Section. |
| data | <code>object</code> | The data to associate with the section. |
| corner | <code>&#x27;top-left&#x27;</code> \| <code>&#x27;top-right&#x27;</code> \| <code>&#x27;bottom-right&#x27;</code> \| <code>&#x27;bottom-left&#x27;</code> \| <code>undefined</code> | Whether the section is a corner. |

<a name="Layout+deleteAllSections"></a>

### layout.deleteAllSections()
Delete all sections within the Layout.

**Kind**: instance method of [<code>Layout</code>](#Layout)  
<a name="Layout+deleteSections"></a>

### layout.deleteSections(x, y)
Delete sections located at coordinates.

**Kind**: instance method of [<code>Layout</code>](#Layout)  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="Layout+deleteSection"></a>

### layout.deleteSection(section) ⇒ <code>Section</code>
Delete a specific section.

**Kind**: instance method of [<code>Layout</code>](#Layout)  

| Param | Description |
| --- | --- |
| section | The section to delete from the Layout. |

<a name="Layout+removeSection"></a>

### layout.removeSection(section) ⇒ <code>Section</code>
Same as deleteSection.

**Kind**: instance method of [<code>Layout</code>](#Layout)  

| Param | Description |
| --- | --- |
| section | The section to delete from the Layout. |

<a name="Layout+toString"></a>

### layout.toString() ⇒ <code>string</code>
Create an ASCII representation of the Layout.

**Kind**: instance method of [<code>Layout</code>](#Layout)  
<a name="Layout+add"></a>

### layout.add(left, top, right, bottom, x, y, width, height, corner, name, data) ⇒ <code>Section</code>
Add a section to the Layout using more flexible options.

**Kind**: instance method of [<code>Layout</code>](#Layout)  
**Returns**: <code>Section</code> - - The Section added.  

| Param | Type | Description |
| --- | --- | --- |
| left |  | The left bound. |
| top |  | The top bound. |
| right |  | The right bound. |
| bottom |  | The bottom bound. |
| x |  | The left bound. |
| y |  | The right bound. |
| width |  | The right bound, minus x. |
| height |  | The bottom bound, minus y. |
| corner | <code>&#x27;top-left&#x27;</code> \| <code>&#x27;top-right&#x27;</code> \| <code>&#x27;bottom-right&#x27;</code> \| <code>&#x27;bottom-left&#x27;</code> \| <code>undefined</code> | Whether the section is a corner. |
| name |  | The name of the Section. |
| data |  | The data to associate with the Section. |

<a name="Section"></a>

## Section
The Section class.

**Kind**: global class  

* [Section](#Section)
    * [.layout](#Section+layout) : <code>Layout</code>
    * [.name](#Section+name) : <code>string</code>
    * [.left](#Section+left) : <code>number</code>
    * [.top](#Section+top) : <code>number</code>
    * [.right](#Section+right) : <code>number</code>
    * [.bottom](#Section+bottom) : <code>number</code>
    * [.data](#Section+data) : <code>\*</code>
    * [.corner](#Section+corner) : <code>&#x27;top-left&#x27;</code> \| <code>&#x27;top-right&#x27;</code> \| <code>&#x27;bottom-right&#x27;</code> \| <code>&#x27;bottom-left&#x27;</code> \| <code>undefined</code>
    * [.leftSections](#Section+leftSections) : <code>Array</code>
    * [.topSections](#Section+topSections) : <code>Array</code>
    * [.rightSections](#Section+rightSections) : <code>Array</code>
    * [.bottomSections](#Section+bottomSections) : <code>Array</code>

<a name="Section+layout"></a>

### section.layout : <code>Layout</code>
**Kind**: instance property of [<code>Section</code>](#Section)  
<a name="Section+name"></a>

### section.name : <code>string</code>
**Kind**: instance property of [<code>Section</code>](#Section)  
<a name="Section+left"></a>

### section.left : <code>number</code>
**Kind**: instance property of [<code>Section</code>](#Section)  
<a name="Section+top"></a>

### section.top : <code>number</code>
**Kind**: instance property of [<code>Section</code>](#Section)  
<a name="Section+right"></a>

### section.right : <code>number</code>
**Kind**: instance property of [<code>Section</code>](#Section)  
<a name="Section+bottom"></a>

### section.bottom : <code>number</code>
**Kind**: instance property of [<code>Section</code>](#Section)  
<a name="Section+data"></a>

### section.data : <code>\*</code>
**Kind**: instance property of [<code>Section</code>](#Section)  
<a name="Section+corner"></a>

### section.corner : <code>&#x27;top-left&#x27;</code> \| <code>&#x27;top-right&#x27;</code> \| <code>&#x27;bottom-right&#x27;</code> \| <code>&#x27;bottom-left&#x27;</code> \| <code>undefined</code>
**Kind**: instance property of [<code>Section</code>](#Section)  
<a name="Section+leftSections"></a>

### section.leftSections : <code>Array</code>
**Kind**: instance property of [<code>Section</code>](#Section)  
<a name="Section+topSections"></a>

### section.topSections : <code>Array</code>
**Kind**: instance property of [<code>Section</code>](#Section)  
<a name="Section+rightSections"></a>

### section.rightSections : <code>Array</code>
**Kind**: instance property of [<code>Section</code>](#Section)  
<a name="Section+bottomSections"></a>

### section.bottomSections : <code>Array</code>
**Kind**: instance property of [<code>Section</code>](#Section)  
