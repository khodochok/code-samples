import { QButton, QInput, QSelect, Form, IconsCommon } from 'quantum_components'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '../../modules/client/referral'
import { getCoupons } from '../../modules/client/referral/referral.selectors'
import { ICartList, IOptionForSelect } from '../../modules/brief/brief.types'
import { ICoupon } from '../../modules/client/referral/referral.types'
import { getCart } from '../../modules/brief/brief.selectors'
import * as cartActions from '../../modules/brief/brief.actions'
import { useParams } from 'react-router-dom'
import { COLORS } from '../../constants/colors'

const checkIcon = <IconsCommon.IconCheck color={COLORS.LIGHT_GREEN} />

const CouponForm = () => {
  const dispatch = useDispatch()
  const coupons = useSelector(getCoupons)
  const cart = useSelector(getCart)
  const { id } = useParams()
  const briefId = id
  const [code, setCode] = useState<string>('')

  useEffect(() => {
    dispatch(actions.fetchCoupons())
  }, [])

  const handleCouponInput = (e: any) => {
    setCode(e.target.value)
  }

  const onAddCoupon = async () => {
    const cartData = {
      briefId,
      additional: cart.additional,
      couponCode: code,
    } as ICartList

    await dispatch(cartActions.addToCart(cartData))
    await dispatch(cartActions.fetchCart(briefId))
  }

  const handleSelect = (option: string) => {
    setCode(option)
  }

  const couponOptions: IOptionForSelect[] = coupons.map((c: ICoupon) => ({ label: c.couponCode, value: c.couponCode }))
  const showSelect = !cart.couponCode && couponOptions.length > 0

  if (!!cart.couponCode) {
    return <div className="qu-discount-badge mb-15">{checkIcon} 5% Discount Applied</div>
  }

  return (
    <div className="coupon-container">
      {showSelect && (
        <QSelect
          value={null}
          onChange={handleSelect}
          className="full-width mb-15"
          options={couponOptions}
          size="large"
          placeholder="Select Coupon Code"
          showArrow
        />
      )}
      <div className="services-discount">
        <Form.Item label="Coupon code">
          <QInput
            value={cart.couponCode ? cart.couponCode : code}
            disabled={!!cart.couponCode}
            onChange={handleCouponInput}
            placeholder="Enter code"
            size="large"
          />
        </Form.Item>
        {!cart.couponCode && (
          <QButton disabled={!code} onClick={onAddCoupon} className="qu-button-soft">
            Add
          </QButton>
        )}
      </div>
    </div>
  )
}

export default CouponForm
