/** @jsx JSX */
import JSX from "!jsx.js";
import "~public/js/requestAnimationFrame.js";
// import "~ui/scss/datagrid.scss";
// import "./a.entry.js";

// import ( /* webpackChunkName: "abc" */ './test.js' ).then( fn => {
//   console.log(fn.default());
// } ).catch( err => {
//   console.log(err);
// } );

let browser = {};
let ie = /MSIE (\d+)\.?/.exec(navigator.userAgent);
if (ie && ie[1]) {
  browser.ie = true;
  browser.version = Number(ie[1]);
}

function getHW(el, type) {
  if (!el) return 0;
  let style = el.style;
  if (style) style[type] = "";
  return el["offset" + (type === "width" ? "Width" : "Height")];
}

function set_list_style(list, property, value) {
  for (let item of list) {
    if (!(item && item.style)) continue;
    item.style[property] = value;
  }
}

function align_cell_column(arr, property) {
  let len = arr.length;
  for (let i = 0; i < len; i++) {
    let column = arr[i];
    let list = column.map((one) => getHW(one, property));
    let max = Math.max(...list) + Math.ceil(len / 2) + "px";
    set_list_style(column, property, max);
  }
}

function align_cell_row(arr, property) {
  let len = arr.length;
  for (let i = 0, il = arr[0].length; i < il; i++) {
    let row = [];
    for (let j = 0; j < len; j++) row.push(arr[j][i]);
    let list = row.map((one) => getHW(one, property));
    let max = Math.max(...list) + Math.ceil(len / 2) + "px";
    set_list_style(row, property, max);
  }
}

function get_head_rows(_this, options, colsType) {
  let rows = options[colsType] || [];
  let il = rows.length;
  let { rowNum, frozenColumns, columns } = options;
  return rows.map(function (row, i) {
    let index = 0;
    let hasRowNum =
      rowNum &&
      !i &&
      (colsType == "frozenColumns" ||
        (!frozenColumns.length && colsType == "columns"));
    return (
      <tr key={i}>
        {hasRowNum ? (
          <td
            rowSpan={frozenColumns.length || columns.length}
            className="field">
            <div className="cell-wrapper">
              <div className="cell" />
            </div>
          </td>
        ) : null}
        {row.map(function (option) {
          let title = option.name || option.field || "";
          let td_attr = {};
          if (option.rowspan) td_attr["rowspan"] = option.rowspan;
          if (option.colspan) td_attr["colspan"] = option.colspan;
          let colspan = option.colspan || 1;
          let isField =
            colspan == 1 && (i == il - 1 || il == i + option.rowspan);
          let width =
            options.autoColWidth || option.colspan
              ? "auto"
              : `${option.width || options.colWidth}px`;
          let cell_attr = { class: "cell", style: { width } };
          if (i) {
            if (colspan == 1) {
              while (_this[colsType][index]) index++;
              if (isField) _this[colsType][index] = option;
            }
            index += colspan;
          } else {
            if (colspan == 1) _this[colsType].push(option);
            else while (colspan--) _this[colsType].push(null);
          }
          if (isField) {
            td_attr["className"] = {
              field: true,
              sortable: options.sortable || option.sortable,
            };
            cell_attr["data-field"] = option.field;
          }
          return (
            <td key={i} {...td_attr}>
              <div className="cell-wrapper">
                <div {...cell_attr}>
                  <span className="field-title">{title}</span>
                  <span className="sort-mark" />
                </div>
              </div>
            </td>
          );
        })}
      </tr>
    );
  });
}

function get_data_rows(options, cols = [], colsType) {
  let data = options.data;
  let { rowNum, frozenColumns } = options;
  return data.map(function (row, i) {
    let hasRowNum =
      rowNum &&
      (colsType == "frozenColumns" ||
        (!frozenColumns.length && colsType == "columns"));
    return (
      <tr key={i}>
        {hasRowNum ? (
          <td>
            <div className="cell-wrapper">
              <div className="cell">{i + options.startRowNum}</div>
            </div>
          </td>
        ) : null}
        {cols.map((option, i) => {
          if (!option) return "";
          let field = option.field,
            val = row[field],
            formatter = option.formatter,
            cls_list = ["cell"],
            align = { left: "txt-lt", right: "txt-rt" }[option.align] || "";
          align && cls_list.push(align);
          let width = options.autoColWidth
            ? "auto;"
            : (option.width || options.colWidth) + "px;";
          return (
            <td key={i}>
              <div className="cell-wrapper">
                <div style={{ width }} className={cls_list}>
                  {
                    (val =
                      typeof formatter === "function"
                        ? formatter(val, row, field)
                        : val)
                  }
                </div>
              </div>
            </td>
          );
        })}
      </tr>
    );
  });
}

function get_table(_this) {
  let { userOptions: options } = _this;
  let { frozenColumns, frozenEndColumns, autoRowHeight } = options;
  return (
    <div className="datagrid-ctn">
      <div
        className={
          "view-wrapper grid" + (autoRowHeight ? " autoRowHeight" : "")
        }>
        {frozenColumns.length ? (
          <div className="col col-view frozen-view frozen-start">
            <div className="head-wrapper">
              <table className="frozen head">
                <tbody>{get_head_rows(_this, options, "frozenColumns")}</tbody>
              </table>
            </div>
            <div className="body-wrapper">
              <table className="frozen body">
                <tbody>
                  {get_data_rows(options, _this.frozenColumns, "frozenColumns")}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
        <div className={`col-rest col-view auto-view locate-view`}>
          <div>
            <div style={{ overflow: "hidden" }}>
              <div className="head-wrapper">
                <table className="head">
                  <tbody>{get_head_rows(_this, options, "columns")}</tbody>
                </table>
              </div>
            </div>
            <div className="body-wrapper">
              <table className="body">
                <tbody>
                  {get_data_rows(options, _this.columns, "columns")}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {frozenEndColumns.length ? (
          <div className="col col-view frozen-view frozen-end">
            <div className="head-wrapper">
              <table className="frozen head">
                <tbody>
                  {get_head_rows(_this, options, "frozenEndColumns")}
                </tbody>
              </table>
            </div>
            <div className="body-wrapper">
              <table className="frozen body">
                <tbody>
                  {get_data_rows(
                    options,
                    _this.frozenEndColumns,
                    "frozenEndColumns"
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function set_table_size(value, _this, $autoView = null) {
  $autoView = $autoView || $(".auto-view", _this.render);
  let header_height = $autoView.find(".head-wrapper")[0].offsetHeight;
  $(".body-wrapper", _this.render).css({ height: value - header_height });
  // let auto = $autoView.find( ".body-wrapper" )[ 0 ];
  // if( browser.ie && browser.version < 10 ) requestAnimationFrame( () => {
  //   let bar_width = auto.offsetWidth - auto.clientWidth;
  //   $autoView.css( { width: $autoView.find( "table" )[ 1 ].offsetWidth - bar_width } );
  //   $( ".body-wrapper", _this.render ).css( { height: value - header_height } );
  // } );
}

function resize_table(_this) {
  let $tables = $("table", _this.render);
  let $autoView = $(".auto-view", _this.render);
  let $autoTable = $("table", $autoView).parent();
  let tp0 = $autoTable.eq(0);
  let tp1 = $autoTable.eq(1);
  let auto = $autoView.find(".body-wrapper")[0];
  $autoTable.css({ width: 500000 });
  let options = _this.userOptions;

  function update_scroll_offset() {
    let aView = tp0[0].parentNode;
    aView.scrollLeft = this.scrollLeft;
    if (options.frozenColumns.length) {
      let fView = $tables[1].parentNode;
      fView.scrollTop = this.scrollTop;
    }
    if (options.frozenEndColumns.length) {
      let feView = $(".frozen-end table", _this.render)[1].parentNode;
      feView.scrollTop = this.scrollTop;
    }
  }
  $(".auto-view .body-wrapper", _this.render)
    .off("scroll")
    .on("scroll", function () {
      // let data = _this.relatedData;
      // if(data) $([data.frozenTr, data.frozenEndTr, data.tr].filter(function(item){ return item; })).removeClass('hover');
      if (this._scroll_id) {
        cancelAnimationFrame(this._scroll_id);
        this._scroll_id = null;
      }
      this._scroll_id = requestAnimationFrame(update_scroll_offset.bind(this));
    });
  if (options.autoColWidth) {
    let column = _this.fieldElements;
    if (options.rowNum)
      column = [$("tr:eq(0) td:eq(0) .cell", $tables[0])[0]].concat(column);
    align_cell_row(
      [
        column,
        $tables.filter("table:odd").find("tr:first-child td .cell").toArray(),
      ],
      "width"
    );
  } else if (options.rowNum) {
    align_cell_row(
      [
        $("tr:eq(0) td:eq(0) .cell:eq(0)", $tables[0]).toArray(),
        $("tr:first-child td:first-child .cell", $tables[1]).toArray(),
      ],
      "width"
    );
  }
  if (options.frozenColumns.length || options.frozenEndColumns.length) {
    $([$tables[1], $tables[5]])
      .off("mousewheel DOMMouseScroll")
      .on("mousewheel DOMMouseScroll", function (e) {
        // let data = _this.relatedData;
        // if(data) $([data.frozenTr, data.frozenEndTr, data.tr].filter(function(item){ return item; })).removeClass('hover');
        let originalEvent = e.originalEvent;
        let tb3 = $tables[3].parentNode;
        let list = [tb3, $tables[1].parentNode];
        if ($tables[5]) list.push($tables[5].parentNode);
        if ($(list).is(":animated")) return false;
        let scroll_height = tb3.scrollHeight - tb3.clientHeight;
        let _sh =
          tb3.scrollTop -
          (originalEvent.wheelDelta || -(originalEvent.detail / 3) * 120);
        _sh = _sh > scroll_height ? scroll_height : _sh;
        _sh = _sh < 0 ? 0 : _sh;
        $(list).animate(
          {
            scrollTop: "+" + (_sh > scroll_height ? scroll_height : _sh) + "px",
          },
          230
        );
        if (_sh !== $(list).scrollTop()) return false;
      });
    if (options.autoRowHeight) {
      align_cell_row(
        $("table:odd", _this.render)
          .toArray()
          .map(function (table) {
            return $("td:first-child", table).toArray();
          }),
        "height"
      );
    }
    align_cell_column(
      [$tables.filter(":odd").toArray(), $tables.filter(":even").toArray()],
      "height"
    );
  }
  align_cell_row(
    [$tables.filter(":odd").toArray(), $tables.filter(":even").toArray()],
    "width"
  );

  tp1.css({ width: "auto" });
  tp0.parent().css({ width: "auto", overflow: "hidden" });
  requestAnimationFrame(function () {
    // let style = _this.render.style;
    // if ( style.height ) style.height = "auto";
    set_table_size(_this.render.offsetHeight, _this, $autoView);
    requestAnimationFrame(function () {
      let bar_height = auto.offsetHeight - auto.clientHeight;
      let $tables = $(".frozen-view .body-wrapper table", _this.render);
      $tables.css({ marginBottom: bar_height });
      // browser.version < 8 &&
      //   requestAnimationFrame( function() {
      //     $tables.css( { marginBottom: bar_height } );
      //   } );
    });
  });
}

class Handler {
  sortOrderDesc = false; // true:desc, false:asc
  constructor(box, options) {
    this.render = box;
    this.update(options);
    this.init_event(options);
    options.onCreate && options.onCreate.bind(this)();
  }
  update(options) {
    if ($(this.render).hasClass("state-loading")) return false;
    $(this.render).addClass("datagrid-render-ctn state-loading");
    setTimeout(() => {
      if ("function" === typeof options.data) {
        options.data((data) => {
          options.data = data;
          this._update(options);
        });
      } else this._update(options);
    }, 0);
    return this;
  }
  _setOptions(options) {
    let old_options = this.userOptions;
    if (old_options) {
      if (options.data && options.data.length) {
        let data = old_options.data;
        if (
          data &&
          data.length &&
          (data[0].tr || data[0].frozenTr || data[0].frozenEndTr)
        ) {
          data.forEach(function (rowData) {
            delete rowData.tr;
            if (old_options.frozenColumns.length) delete rowData.frozenTr;
            if (old_options.frozenEndColumns.length) delete rowData.frozenEndTr;
          });
        }
        this.userOptions.data = options.data;
        delete options.data;
      }
      options = $.extend(true, {}, this.userOptions, options);
    }
    return options;
  }
  _update(options) {
    let box = this.render;
    this.columns = [];
    this.frozenColumns = [];
    this.frozenEndColumns = [];
    this.userOptions = options = this._setOptions(options);
    box.innerHTML = "";
    box.insertAdjacentHTML("beforeEnd", get_table(this));
    this.allColumns = [].concat(
      this.frozenColumns,
      this.columns,
      this.frozenEndColumns
    );
    // console.log(this.allColumns);
    this.fieldElements = this.allColumns.map(function (option) {
      return $(`[data-field="${option.field}"]`, box)[0];
    });
    // console.log(this.fieldElements);

    options.data.forEach(function (rowData, rowNum) {
      if (options.frozenColumns.length) {
        let tbody = $(".frozen-view .body tbody", box)[0];
        rowData.frozenTr = tbody.rows[rowNum];
      }
      if (options.frozenEndColumns.length) {
        let tbody = $(".frozen-end .body tbody", box)[0];
        rowData.frozenEndTr = tbody.rows[rowNum];
      }
      if (options.columns.length) {
        let tbody = $(".auto-view .body tbody", box)[0];
        rowData.tr = tbody.rows[rowNum];
      }
    });
    let sort = options.sort;
    if (options.remoteSort) {
      let sort_order = ~[true, "desc"].indexOf(sort.order) ? "desc" : "asc";
      $(`.head-wrapper [data-field="${sort.field}"] .sort-mark`, box).addClass(
        sort_order
      );
    } else if (sort) {
      this.sortBy({ field: sort.field, order: sort.order });
    }
    this.reAlign();
  }
  resetTableHeight(value) {
    $(this.render).height(value);
    set_table_size(value, this);
    return this;
  }
  reAlign() {
    /* TODO :
     * 1、全部行、全部列、单行、单列对齐重新对齐功能
     * */
    let _this = this;
    resize_table(_this);
    let { ie, version } = browser;
    if (ie && version < 10) setTimeout(() => resize_table(_this), 0);
    requestAnimationFrame(function () {
      if (ie && version < 8) {
        let $frozen_view = $(".frozen-view", _this.render);
        let $auto_view = $(".auto-view", _this.render);
        $auto_view
          .css({
            width: "auto",
            "margin-left": $frozen_view[0].offsetWidth,
            "margin-right": $frozen_view[1].offsetWidth,
          })
          .find(".body-wrapper")
          .css({ "margin-top": "-2px" });
        requestAnimationFrame(function () {
          $frozen_view.eq(1).css({
            "margin-left": $(".body-wrapper", $auto_view)[0].offsetWidth,
          });
        });
      }
      requestAnimationFrame(function () {
        $(_this.render).removeClass("state-loading");
        _this.userOptions.onUpdate && _this.userOptions.onUpdate.bind(_this)();
      });
    });
    return this;
  }
  init_event(options) {
    let _this = this;
    let $box = $(this.render);
    if (!options.remoteSort)
      $box.on("click", ".field.sortable", function () {
        let cell = $(".cell", this)[0];
        _this.sortBy(
          {
            field: $(cell).data("field"),
            order: !cell.order || _this.sortOrderDesc,
          },
          cell
        );
      });
    if (
      options.triggerRow &&
      (options.frozenColumns.length || options.frozenEndColumns.length)
    )
      $box.on(
        {
          mouseenter: function (e) {
            let target = this;
            let box = e.delegateTarget;
            if (box._triggering_in) {
              cancelAnimationFrame(box._triggering_in);
              box._triggering_in = null;
            }
            box._triggering_in = requestAnimationFrame(function () {
              let data = _this.relatedData;
              if (data)
                $(
                  [data.frozenTr, data.frozenEndTr, data.tr].filter(function (
                    item
                  ) {
                    return item;
                  })
                ).removeClass("hover");
              _this.relatedData = data =
                _this.userOptions.data[target.rowIndex];
              $(
                [data.frozenTr, data.frozenEndTr, data.tr].filter(function (
                  item
                ) {
                  return item;
                })
              ).addClass("hover");
            });
          },
          mouseleave: function (e) {
            let box = e.delegateTarget;
            if (box._triggering_out) {
              cancelAnimationFrame(box._triggering_out);
              box._triggering_out = null;
            }
            box._triggering_out = requestAnimationFrame(function () {
              let data = _this.relatedData;
              if (data)
                $(
                  [data.frozenTr, data.frozenEndTr, data.tr].filter(function (
                    item
                  ) {
                    return item;
                  })
                ).removeClass("hover");
              _this.relatedData = null;
            });
          },
        },
        ".body-wrapper tr"
      );
  }
  sortType = {
    string: function (a, b) {
      // this指{field:field, order:order}
      let field = this.field;
      let x = a[field];
      let y = b[field];
      if (x == y) return 0;
      return x > y ? 1 : -1;
    },
    number: function (a, b) {
      let field = this.field;
      return a[field] - b[field];
    },
  };
  getFieldOption(fieldName) {
    return this.allColumns.filter((one) => one.field === fieldName)[0];
  }
  getColumnSortFunction({ order, field }) {
    let field_option = this.getFieldOption(field); // 列的选项
    if (!field_option) {
      console.log({ order, field }, "Field not found......");
      throw new Error("Field not found:" + field);
    }
    let sort_type =
      field_option.dataType || this.userOptions.dataType || "string"; // 排序的类型
    let fn = field_option.sort || this.sortType[sort_type]; // 排序的函数
    return (a, b) => fn.call({ order, field }, a, b) * (order ? -1 : 1);
  }
  sortBy({ order, field }, sortElement) {
    // order: (true||'desc')->desc, (false||not 'desc')->asc
    let options = this.userOptions;
    let preSortElement = this.sortElement;
    order = ~[true, "desc"].indexOf(order) ? true : false;
    this.sortElement = sortElement =
      sortElement || $(`.head-wrapper [data-field="${field}"]`, this.render)[0];
    if (preSortElement) {
      if (sortElement === preSortElement) {
        // 同一列
        if (order === preSortElement.order) return this; // 排序无变化
        options.data = options.data.reverse();
      }
      $(".sort-mark", preSortElement).removeClass("asc desc");
    }
    $(".sort-mark", sortElement).addClass(order ? "desc" : "asc");
    options.data.sort(this.getColumnSortFunction({ order, field }));
    sortElement.order = order;
    sortElement.field = field;
    $(this.render).addClass("state-loading");
    setTimeout(() => {
      this.sort_table_dom(options);
      setTimeout(() => {
        $(this.render).removeClass("state-loading");
      }, 0);
    }, 0);
    return this;
  }
  sort_table_dom(options) {
    let frozenTrDoc = document.createDocumentFragment(),
      frozenEndTrDoc = document.createDocumentFragment(),
      trDoc = document.createDocumentFragment(),
      frozenTbody = null,
      frozenEndTbody = null,
      tbody = null;
    options.data.forEach(function (rowData, rowNum) {
      let frozenTr = rowData.frozenTr;
      let frozenEndTr = rowData.frozenEndTr;
      let tr = rowData.tr;
      if (frozenTr) {
        frozenTbody ||
          (function () {
            frozenTbody = frozenTr.parentNode;
            frozenTbody.style.display = "none";
          })();
        frozenTrDoc.appendChild(frozenTr);
        if (options.rowNum)
          $("td:eq(0) .cell", frozenTr).text(options.startRowNum + rowNum);
      }
      if (frozenEndTr) {
        frozenEndTbody ||
          (function () {
            frozenEndTbody = frozenEndTr.parentNode;
            frozenEndTbody.style.display = "none";
          })();
        frozenEndTrDoc.appendChild(frozenEndTr);
      }
      if (tr) {
        tbody ||
          (function () {
            tbody = tr.parentNode;
            tbody.style.display = "none";
          })();
        trDoc.appendChild(tr);
        if (!frozenTr && options.rowNum)
          $("td:eq(0) .cell", tr).text(rowNum + 1);
      }
    });
    if (frozenTbody && (frozenTrDoc.children || frozenTrDoc.childNodes)) {
      frozenTbody.appendChild(frozenTrDoc);
      frozenTbody.style.display = "";
    }
    if (
      frozenEndTbody &&
      (frozenEndTrDoc.children || frozenEndTrDoc.childNodes)
    ) {
      frozenEndTbody.appendChild(frozenEndTrDoc);
      frozenEndTbody.style.display = "";
    }
    if (tbody && (trDoc.children || trDoc.childNodes)) {
      tbody.appendChild(trDoc);
      tbody.style.display = "";
    }
    (frozenTrDoc = null), (trDoc = null), (frozenTbody = null), (tbody = null);
    return this;
  }
}

let defaultOptions = {
  align: "center", // 内容对齐方式
  autoRowHeight: true, // 单元格高度是否自动对齐
  autoColWidth: true, // 单元格宽度是否自动对齐
  colWidth: 80, // 默认单元格内容宽度
  rowNum: false, // 是否显示行号
  startRowNum: 1, // 行号开始值
  triggerRow: false, // hover是否高亮整行
  data: [], // 数据内容
  sortable: false, // 列是否可排序
  sort: null, // 排序选项
  dataType: "string", // 数据类型
  remoteSort: false, // 是否服务器排序
  frozenColumns: [], // 冻结列
  frozenEndColumns: [], // 冻结列
  columns: [], // 普通列
};

$.fn.datagrid = function (options, ...args) {
  if ("string" === $.type(options)) {
    let ret = this.toArray().map(function (one) {
      let ui = $(one).data("ui");
      if (ui && ui.iDataGrid) {
        return ui.iDatagrid[options].apply(ui.iDatagrid, args);
      } else {
        throw new Error("UI:datagrid does not init...");
      }
    });
    let len = ret[0].length;
    if (0 === len) return this;
    if (1 === len) return ret[0];
    else return ret;
  }
  options = $.extend(true, defaultOptions, options);
  if (!options.columns.length)
    throw new Error("datagrid must have columns option！");
  return this.each(function () {
    let $this = $(this);
    let instance = new Handler(this, $.extend(true, {}, options));
    let ui = $this.data("ui");
    if (ui) ui.iDatagrid = instance;
    else $this.data("ui", { iDatagrid: instance });
  });
};
