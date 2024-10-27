require 'test_helper'

class DoorsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @door = doors(:one)
  end

  test "should get index" do
    get doors_url, as: :json
    assert_response :success
  end

  test "should create door" do
    assert_difference('Door.count') do
      post doors_url, params: { door: { description: @door.description, identification: @door.identification } }, as: :json
    end

    assert_response 201
  end

  test "should show door" do
    get door_url(@door), as: :json
    assert_response :success
  end

  test "should update door" do
    patch door_url(@door), params: { door: { description: @door.description, identification: @door.identification } }, as: :json
    assert_response 200
  end

  test "should destroy door" do
    assert_difference('Door.count', -1) do
      delete door_url(@door), as: :json
    end

    assert_response 204
  end
end
