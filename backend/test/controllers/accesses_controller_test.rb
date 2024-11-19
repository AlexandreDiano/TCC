require 'test_helper'

class AccessesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @access = accesses(:one)
  end

  test "should get index" do
    get accesses_url, as: :json
    assert_response :success
  end

  test "should create access" do
    assert_difference('Access.count') do
      post accesses_url, params: { access: { door_id: @access.door_id, type: @access.type, user_id: @access.user_id } }, as: :json
    end

    assert_response 201
  end

  test "should show access" do
    get access_url(@access), as: :json
    assert_response :success
  end

  test "should update access" do
    patch access_url(@access), params: { access: { door_id: @access.door_id, type: @access.type, user_id: @access.user_id } }, as: :json
    assert_response 200
  end

  test "should destroy access" do
    assert_difference('Access.count', -1) do
      delete access_url(@access), as: :json
    end

    assert_response 204
  end
end
