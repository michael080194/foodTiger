'use strict';
// 動態載入先前點的所有餐
function setOrderList(order) {
    let totalPrice = 0;
    for (let i = 0; i < order.length; i++) {
        let data = `
            <li class="swipeout">
                <div class="item-content swipeout-content">
                    <div class="item-media">
                        <span class="badge color-red checkout-amount">
                            ${ order[i].qty }
                        </span>
                    </div>
                    <div class="item-inner">
                        <div class="item-title checkout-title">
                            ${ order[i].name }
                        </div>
                        <div class="item-after checkout-price">
                            <span> ${ order[i].price } </span> 元 / ${ order[i].unit} 
                        </div>
                    </div>
                </div>
                <div class="swipeout-actions-right">
                    <a href="#" data-confirm="確定要取消這份餐點嗎？" data-confirm-title="注意" class="swipeout-delete">刪除</a>
                </div>
            </li>`;

        totalPrice += order[i].price * order[i].qty;
        $$('.list-checkout > ul').append(data);
    }

    $$('.total-price-sured > span').text(totalPrice);
}

function prepareCheckout(order) {
  let items = $$('.list li.item-choose');
  let countOrder = items.length;
  for (let i = 0; i < countOrder; i++) {
      order[i] = {};
      order[i].partno = items.eq(i).find('.item-partno').text();;
      order[i].unit   = items.eq(i).find('.item-unit').text();;
      order[i].name   = items.eq(i).find('.item-title').text();
      order[i].price  = parseInt(items.eq(i).find('.item-price').text());
      order[i].qty    = parseInt(items.eq(i).find('.item-amount').text());
  }
}

let toastCheckout = app.toast.create({
  text: '您尚未點餐喔。',
  position: 'top',
  closeTimeout: 2000
});

// 刪除餐點後更新總金額
$$(document).on('swipeout:deleted', '.swipeout', function () {
    // `swipeout:deleted` 是在刪除動畫結束、DOM刪除之前的動作
    // 所以先記錄被刪除項目的資料以正確地更新總金額
    let self = $$(this);
    let selfPrice = parseInt(self.find('.checkout-price > span').text());
    let selfAmount = parseInt(self.find('.checkout-amount').text());

    let items = $$('.list-checkout > ul li');
    let countItems = items.length;
    let totalPrice = 0;

    // 再次確保餐點刪除前的總金額是正確的
    for (let i = 0; i < countItems; i++) {
        let item = items.eq(i);
        let price = parseInt(item.find('.checkout-price > span').text());
        let amount = parseInt(item.find('.checkout-amount').text());
        totalPrice += price * amount;
    }

    totalPrice -= selfPrice * selfAmount;
    $$('.total-price-sured > span').text(totalPrice);
});

$$(document).on('click', '.checkout', function () {
  let itemList = $$('.list ul li.swipeout');
  let itemCount = itemList.length
  let order = [];

  for (let i = 0; i < itemCount; i++) {
      order[i] = {
          name: itemList.eq(i).find('.item-content .item-inner > .item-title').text(),
          amount: itemList.eq(i).find('.item-content .item-media > .badge').text()
      }
  }
  alert(JSON.stringify(pub_orderLists));
});