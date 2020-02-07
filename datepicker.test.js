import { mount } from '@vue/test-utils'
import Datepicker from '@/components/Datepicker.vue'

describe('Datepicker Component', () => {
  test('is a Vue instance', () => {
		const wrapper = mount(Datepicker)
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
